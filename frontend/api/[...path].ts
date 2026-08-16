// @ts-nocheck
/**
 * Single Vercel serverless function for all /api/* routes (Hobby plan: max 12 functions).
 * Helpers live in ../lib/api/* (not under /api, so they are not separate functions).
 * Use when Vercel Root Directory is `frontend`. If the project root is the repo root, the handler is `../../api/[...path].ts` instead.
 */
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb.js";
import { apiPathSegments } from "../lib/api/helpers.js";
import {
  requireAdminJwt,
  verifyAdminCredentials,
  adminCredentialsConfigured,
  signAdminJwt,
  verifyAdminJwt,
  readSessionCookie,
  setSessionCookie,
  clearSessionCookie,
} from "../lib/api/auth.js";
import { normalizeProjectBody } from "../lib/api/projectBody.js";
import { normalizeSkillBody } from "../lib/api/skillBody.js";
import { experienceFromClient } from "../lib/api/experienceBody.js";
import { educationFromClient } from "../lib/api/educationBody.js";
import { aboutFromClient, contactFromClient, heroFromClient } from "../lib/api/singletonPayloads.js";
import {
  rejectDataImageField,
  rejectDataImagesInStringArray,
  rejectDataVideoField,
} from "../lib/api/imagePolicy.js";
import About from "../models/About.js";
import Contact from "../models/Contact.js";
import Education from "../models/Education.js";
import Experience from "../models/Experience.js";
import Hero from "../models/Hero.js";
import Project from "../models/Project.js";
import Skill from "../models/Skill.js";

function invalidMongoIdResponse(res: any) {
  return res.status(400).json({
    error:
      "Invalid document id. For built-in placeholder rows, use Save as new (creates a POST) or run Dashboard → Copy built-in content to database first.",
  });
}

export default async function handler(req: any, res: any) {
  let seg: string[];
  try {
    seg = apiPathSegments(req);
  } catch {
    return res.status(400).json({ error: "Invalid request URL" });
  }
  const method = req.method || "GET";

  try {
    // —— Health (for Atlas / env debugging; no DB write required) ——
    if (seg[0] === "health" && seg.length === 1 && method === "GET") {
      if (!process.env.MONGODB_URI) {
        return res.status(503).json({
          ok: false,
          mongodbUriConfigured: false,
          message: "MONGODB_URI is not set. Add it to .env.local for vercel dev, or to Vercel project env.",
        });
      }
      try {
        await connectDB();
        return res.status(200).json({
          ok: true,
          mongodbUriConfigured: true,
          databaseName: mongoose.connection?.db?.databaseName ?? null,
          message:
            "Connected. In Atlas → Browse Collections, open this database name. It appears only after the first write (e.g. seed or create a document).",
        });
      } catch (e) {
        return res.status(503).json({
          ok: false,
          mongodbUriConfigured: true,
          message: e?.message || String(e),
        });
      }
    }

    // —— TEMP diagnostic: reports env var shape only, never actual secret values. Remove after debugging. ——
    if (seg[0] === "admin-env-check" && seg.length === 1 && method === "GET") {
      const email = process.env.ADMIN_EMAIL?.trim() ?? "";
      const hash = process.env.ADMIN_PASSWORD_HASH?.trim() ?? "";
      const jwt = process.env.JWT_SECRET?.trim() ?? "";
      return res.status(200).json({
        emailConfigured: email.length > 0,
        emailLength: email.length,
        emailDomain: email.includes("@") ? email.split("@")[1] : null,
        hashConfigured: hash.length > 0,
        hashLength: hash.length,
        hashDollarCount: (hash.match(/\$/g) || []).length,
        hashPrefix: hash.slice(0, 4),
        jwtConfigured: jwt.length > 0,
        jwtLength: jwt.length,
      });
    }

    // —— Admin auth: login / logout / session check (no DB connection required) ——
    // NOTE: kept as single path segments (admin-login, not admin/login) — this Vercel
    // deployment's catch-all routing 404s on 2+ segment /api/ paths at the platform level
    // (reproducible even for pre-existing routes like /api/projects/reorder, survives a
    // clean redeploy, and no dashboard-level rewrite explains it), so every admin route
    // here is deliberately flattened to one segment to route around that platform issue.
    if (seg[0] === "admin-login" && seg.length === 1 && method === "POST") {
      if (!adminCredentialsConfigured()) {
        return res.status(500).json({
          error: "Admin credentials are not configured on the server (missing ADMIN_EMAIL/ADMIN_PASSWORD_HASH env vars).",
        });
      }
      const { email, password } = req.body || {};
      const ok = await verifyAdminCredentials(email, password);
      if (!ok) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = await signAdminJwt(String(email).trim().toLowerCase());
      setSessionCookie(res, token);
      return res.status(200).json({ ok: true });
    }

    if (seg[0] === "admin-logout" && seg.length === 1 && method === "POST") {
      clearSessionCookie(res);
      return res.status(200).json({ ok: true });
    }

    if (seg[0] === "admin-me" && seg.length === 1 && method === "GET") {
      const token = readSessionCookie(req);
      const payload = token ? await verifyAdminJwt(token) : null;
      if (!payload) {
        return res.status(200).json({ authenticated: false });
      }
      return res.status(200).json({ authenticated: true, email: payload.sub });
    }

    // —— Admin: image upload → Vercel Blob (public URL stored in MongoDB; no DB connection required) ——
    if (seg[0] === "admin-upload-image" && seg.length === 1 && method === "POST") {
      if (!(await requireAdminJwt(req, res))) return;
      const dataUrl = req.body?.dataUrl;
      if (typeof dataUrl !== "string") {
        return res.status(400).json({ error: "Expected JSON body { dataUrl: string }" });
      }
      const { uploadPortfolioImageFromDataUrl } = await import("../lib/api/uploadBlob.js");
      const result = await uploadPortfolioImageFromDataUrl(dataUrl);
      if (result.error) {
        return res.status(result.status ?? 500).json({ error: result.error });
      }
      return res.status(200).json({ url: result.url });
    }

    // —— Admin: hero video upload → client-direct-to-Blob token endpoint (no DB connection required) ——
    if (seg[0] === "admin-hero-video-upload" && seg.length === 1 && method === "POST") {
      const { handleUpload } = await import("@vercel/blob/client");
      try {
        const jsonResponse = await handleUpload({
          body: req.body,
          request: req,
          onBeforeGenerateToken: async () => {
            const ok = await requireAdminJwt(req, res);
            if (!ok) {
              throw new Error("Unauthorized");
            }
            return {
              allowedContentTypes: ["video/mp4", "video/webm", "video/ogg"],
              maximumSizeInBytes: 75 * 1024 * 1024,
              addRandomSuffix: true,
            };
          },
          onUploadCompleted: async () => {
            // no-op: the client's own subsequent PUT /api/hero call carries the resulting URL
          },
        });
        return res.status(200).json(jsonResponse);
      } catch (e: any) {
        if (res.headersSent) return;
        return res.status(400).json({ error: e?.message || "Upload failed" });
      }
    }

    await connectDB();

    // —— Admin: seed built-in defaults only into empty collections (never deletes) ——
    if (seg[0] === "admin-seed-defaults" && seg.length === 1) {
      if (method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: "Method not allowed" });
      }
      if (!(await requireAdminJwt(req, res))) return;
      const { seedDefaultPortfolioIfEmpty } = await import("../lib/seedDefaultPortfolio.js");
      const summary = await seedDefaultPortfolioIfEmpty();
      return res.status(200).json({ ok: true, summary });
    }

    // —— Projects ——
    if (seg[0] === "projects") {
      if (seg.length === 1) {
        if (method === "GET") {
          const list = await Project.find().sort({ featured: -1, order: 1 }).lean();
          return res.status(200).json(list);
        }
        if (method === "POST") {
          if (!(await requireAdminJwt(req, res))) return;
          const raw = normalizeProjectBody(req.body);
          const imgErr =
            rejectDataImageField("mainPhoto", raw.mainPhoto) ||
            rejectDataImagesInStringArray("additionalPhotos", raw.additionalPhotos);
          if (imgErr) return res.status(400).json({ error: imgErr });
          const max = await Project.findOne().sort({ order: -1 }).select("order").lean();
          const nextOrder = (max?.order ?? -1) + 1;
          const doc = await new Project({ ...raw, order: raw.order || nextOrder }).save();
          return res.status(201).json(doc);
        }
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: "Method not allowed" });
      }
      if (seg.length === 2 && seg[1] === "reorder") {
        if (method !== "PUT") {
          res.setHeader("Allow", ["PUT"]);
          return res.status(405).json({ error: "Method not allowed" });
        }
        if (!(await requireAdminJwt(req, res))) return;
        const items = Array.isArray(req.body) ? req.body : req.body?.items;
        if (!Array.isArray(items)) {
          return res.status(400).json({ error: "Expected array of { id, order }" });
        }
        for (const row of items) {
          if (!row?.id || !mongoose.isValidObjectId(row.id)) continue;
          await Project.findByIdAndUpdate(row.id, { $set: { order: row.order ?? 0 } });
        }
        const list = await Project.find().sort({ featured: -1, order: 1 }).lean();
        return res.status(200).json(list);
      }
      if (seg.length === 2) {
        const id = seg[1];
        if (method === "PUT" || method === "DELETE") {
          if (!mongoose.isValidObjectId(id)) return invalidMongoIdResponse(res);
        }
        if (method === "PUT") {
          if (!(await requireAdminJwt(req, res))) return;
          const raw = normalizeProjectBody(req.body);
          const imgErr =
            rejectDataImageField("mainPhoto", raw.mainPhoto) ||
            rejectDataImagesInStringArray("additionalPhotos", raw.additionalPhotos);
          if (imgErr) return res.status(400).json({ error: imgErr });
          const doc = await Project.findByIdAndUpdate(id, raw, { new: true }).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        if (method === "DELETE") {
          if (!(await requireAdminJwt(req, res))) return;
          const doc = await Project.findByIdAndDelete(id).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        res.setHeader("Allow", ["PUT", "DELETE"]);
        return res.status(405).json({ error: "Method not allowed" });
      }
    }

    // —— Skills ——
    if (seg[0] === "skills") {
      if (seg.length === 1) {
        if (method === "GET") {
          const list = await Skill.find().sort({ order: 1 }).lean();
          return res.status(200).json(list);
        }
        if (method === "POST") {
          if (!(await requireAdminJwt(req, res))) return;
          const raw = normalizeSkillBody(req.body);
          const ie = rejectDataImageField("icon", raw.icon);
          if (ie) return res.status(400).json({ error: ie });
          const max = await Skill.findOne().sort({ order: -1 }).select("order").lean();
          const nextOrder = (max?.order ?? -1) + 1;
          const doc = await new Skill({ ...raw, order: raw.order || nextOrder }).save();
          return res.status(201).json(doc);
        }
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: "Method not allowed" });
      }
      if (seg.length === 2 && seg[1] === "reorder") {
        if (method !== "PUT") {
          res.setHeader("Allow", ["PUT"]);
          return res.status(405).json({ error: "Method not allowed" });
        }
        if (!(await requireAdminJwt(req, res))) return;
        const items = Array.isArray(req.body) ? req.body : req.body?.items;
        if (!Array.isArray(items)) {
          return res.status(400).json({ error: "Expected array of { id, order }" });
        }
        for (const row of items) {
          if (!row?.id || !mongoose.isValidObjectId(row.id)) continue;
          await Skill.findByIdAndUpdate(row.id, { $set: { order: row.order ?? 0 } });
        }
        const list = await Skill.find().sort({ order: 1 }).lean();
        return res.status(200).json(list);
      }
      if (seg.length === 2) {
        const id = seg[1];
        if (method === "PUT" || method === "DELETE") {
          if (!mongoose.isValidObjectId(id)) return invalidMongoIdResponse(res);
        }
        if (method === "PUT") {
          if (!(await requireAdminJwt(req, res))) return;
          const raw = normalizeSkillBody(req.body);
          const ie = rejectDataImageField("icon", raw.icon);
          if (ie) return res.status(400).json({ error: ie });
          const doc = await Skill.findByIdAndUpdate(id, raw, { new: true }).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        if (method === "DELETE") {
          if (!(await requireAdminJwt(req, res))) return;
          const doc = await Skill.findByIdAndDelete(id).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        res.setHeader("Allow", ["PUT", "DELETE"]);
        return res.status(405).json({ error: "Method not allowed" });
      }
    }

    // —— Experience ——
    if (seg[0] === "experience") {
      if (seg.length === 1) {
        if (method === "GET") {
          const list = await Experience.find().sort({ order: 1 }).lean();
          return res.status(200).json(list);
        }
        if (method === "POST") {
          if (!(await requireAdminJwt(req, res))) return;
          const raw = experienceFromClient(req.body);
          const le = rejectDataImageField("companyLogo", raw.companyLogo);
          if (le) return res.status(400).json({ error: le });
          const max = await Experience.findOne().sort({ order: -1 }).select("order").lean();
          const nextOrder = (max?.order ?? -1) + 1;
          const doc = await new Experience({ ...raw, order: raw.order || nextOrder }).save();
          return res.status(201).json(doc);
        }
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: "Method not allowed" });
      }
      if (seg.length === 2 && seg[1] === "reorder") {
        if (method !== "PUT") {
          res.setHeader("Allow", ["PUT"]);
          return res.status(405).json({ error: "Method not allowed" });
        }
        if (!(await requireAdminJwt(req, res))) return;
        const items = Array.isArray(req.body) ? req.body : req.body?.items;
        if (!Array.isArray(items)) {
          return res.status(400).json({ error: "Expected array of { id, order }" });
        }
        for (const row of items) {
          if (!row?.id || !mongoose.isValidObjectId(row.id)) continue;
          await Experience.findByIdAndUpdate(row.id, { $set: { order: row.order ?? 0 } });
        }
        const list = await Experience.find().sort({ order: 1 }).lean();
        return res.status(200).json(list);
      }
      if (seg.length === 2) {
        const id = seg[1];
        if (method === "PUT" || method === "DELETE") {
          if (!mongoose.isValidObjectId(id)) return invalidMongoIdResponse(res);
        }
        if (method === "PUT") {
          if (!(await requireAdminJwt(req, res))) return;
          const raw = experienceFromClient(req.body);
          const le = rejectDataImageField("companyLogo", raw.companyLogo);
          if (le) return res.status(400).json({ error: le });
          const doc = await Experience.findByIdAndUpdate(id, raw, { new: true }).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        if (method === "DELETE") {
          if (!(await requireAdminJwt(req, res))) return;
          const doc = await Experience.findByIdAndDelete(id).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        res.setHeader("Allow", ["PUT", "DELETE"]);
        return res.status(405).json({ error: "Method not allowed" });
      }
    }

    // —— Education ——
    if (seg[0] === "education") {
      if (seg.length === 1) {
        if (method === "GET") {
          const list = await Education.find().sort({ order: 1 }).lean();
          return res.status(200).json(list);
        }
        if (method === "POST") {
          if (!(await requireAdminJwt(req, res))) return;
          const raw = educationFromClient(req.body);
          const le = rejectDataImageField("institutionLogo", raw.institutionLogo);
          if (le) return res.status(400).json({ error: le });
          const max = await Education.findOne().sort({ order: -1 }).select("order").lean();
          const nextOrder = (max?.order ?? -1) + 1;
          const doc = await new Education({ ...raw, order: raw.order || nextOrder }).save();
          return res.status(201).json(doc);
        }
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: "Method not allowed" });
      }
      if (seg.length === 2 && seg[1] === "reorder") {
        if (method !== "PUT") {
          res.setHeader("Allow", ["PUT"]);
          return res.status(405).json({ error: "Method not allowed" });
        }
        if (!(await requireAdminJwt(req, res))) return;
        const items = Array.isArray(req.body) ? req.body : req.body?.items;
        if (!Array.isArray(items)) {
          return res.status(400).json({ error: "Expected array of { id, order }" });
        }
        for (const row of items) {
          if (!row?.id || !mongoose.isValidObjectId(row.id)) continue;
          await Education.findByIdAndUpdate(row.id, { $set: { order: row.order ?? 0 } });
        }
        const list = await Education.find().sort({ order: 1 }).lean();
        return res.status(200).json(list);
      }
      if (seg.length === 2) {
        const id = seg[1];
        if (method === "PUT" || method === "DELETE") {
          if (!mongoose.isValidObjectId(id)) return invalidMongoIdResponse(res);
        }
        if (method === "PUT") {
          if (!(await requireAdminJwt(req, res))) return;
          const raw = educationFromClient(req.body);
          const le = rejectDataImageField("institutionLogo", raw.institutionLogo);
          if (le) return res.status(400).json({ error: le });
          const doc = await Education.findByIdAndUpdate(id, raw, { new: true }).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        if (method === "DELETE") {
          if (!(await requireAdminJwt(req, res))) return;
          const doc = await Education.findByIdAndDelete(id).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        res.setHeader("Allow", ["PUT", "DELETE"]);
        return res.status(405).json({ error: "Method not allowed" });
      }
    }

    // —— About / Hero / Contact (singletons) ——
    if (seg.length === 1 && seg[0] === "about") {
      if (method === "GET") {
        const doc = await About.findOne().lean();
        return res.status(200).json(doc);
      }
      if (method === "PUT") {
        if (!(await requireAdminJwt(req, res))) return;
        const payload = aboutFromClient(req.body);
        const ae = rejectDataImageField("profilePhoto", payload.profilePhoto);
        if (ae) return res.status(400).json({ error: ae });
        const doc = await About.findOneAndUpdate({}, payload, { upsert: true, new: true }).lean();
        return res.status(200).json(doc);
      }
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (seg.length === 1 && seg[0] === "hero") {
      if (method === "GET") {
        const doc = await Hero.findOne().lean();
        return res.status(200).json(doc);
      }
      if (method === "PUT") {
        if (!(await requireAdminJwt(req, res))) return;
        const payload = heroFromClient(req.body);
        const he = rejectDataImageField("heroPhoto", payload.heroPhoto);
        if (he) return res.status(400).json({ error: he });
        const ve = rejectDataVideoField("heroVideo", payload.heroVideo);
        if (ve) return res.status(400).json({ error: ve });
        const doc = await Hero.findOneAndUpdate({}, payload, { upsert: true, new: true }).lean();
        return res.status(200).json(doc);
      }
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).json({ error: "Method not allowed" });
    }

    if (seg.length === 1 && seg[0] === "contact") {
      if (method === "GET") {
        const doc = await Contact.findOne().lean();
        return res.status(200).json(doc);
      }
      if (method === "PUT") {
        if (!(await requireAdminJwt(req, res))) return;
        const payload = contactFromClient(req.body);
        const doc = await Contact.findOneAndUpdate({}, payload, { upsert: true, new: true }).lean();
        return res.status(200).json(doc);
      }
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).json({ error: "Method not allowed" });
    }

    return res.status(404).json({ error: "Not found" });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
