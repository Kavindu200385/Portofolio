// @ts-nocheck
/**
 * Single Vercel serverless function for all /api/* routes (Hobby plan: max 12 functions).
 * Helpers live in ../lib/api/* (not under /api, so they are not separate functions).
 */
import mongoose from "mongoose";
import { connectDB } from "../lib/mongodb.js";
import { apiPathSegments, requireAdmin } from "../lib/api/helpers.js";
import { normalizeProjectBody } from "../lib/api/projectBody.js";
import { normalizeSkillBody } from "../lib/api/skillBody.js";
import { experienceFromClient } from "../lib/api/experienceBody.js";
import { educationFromClient } from "../lib/api/educationBody.js";
import { aboutFromClient, contactFromClient, heroFromClient } from "../lib/api/singletonPayloads.js";
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

    await connectDB();

    // —— Admin: seed built-in defaults only into empty collections (never deletes) ——
    if (seg[0] === "admin" && seg[1] === "seed-defaults") {
      if (method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ error: "Method not allowed" });
      }
      if (!requireAdmin(req, res)) return;
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
          if (!requireAdmin(req, res)) return;
          const raw = normalizeProjectBody(req.body);
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
        if (!requireAdmin(req, res)) return;
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
          if (!requireAdmin(req, res)) return;
          const raw = normalizeProjectBody(req.body);
          const doc = await Project.findByIdAndUpdate(id, raw, { new: true }).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        if (method === "DELETE") {
          if (!requireAdmin(req, res)) return;
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
          if (!requireAdmin(req, res)) return;
          const raw = normalizeSkillBody(req.body);
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
        if (!requireAdmin(req, res)) return;
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
          if (!requireAdmin(req, res)) return;
          const raw = normalizeSkillBody(req.body);
          const doc = await Skill.findByIdAndUpdate(id, raw, { new: true }).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        if (method === "DELETE") {
          if (!requireAdmin(req, res)) return;
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
          if (!requireAdmin(req, res)) return;
          const raw = experienceFromClient(req.body);
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
        if (!requireAdmin(req, res)) return;
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
          if (!requireAdmin(req, res)) return;
          const raw = experienceFromClient(req.body);
          const doc = await Experience.findByIdAndUpdate(id, raw, { new: true }).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        if (method === "DELETE") {
          if (!requireAdmin(req, res)) return;
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
          if (!requireAdmin(req, res)) return;
          const raw = educationFromClient(req.body);
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
        if (!requireAdmin(req, res)) return;
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
          if (!requireAdmin(req, res)) return;
          const raw = educationFromClient(req.body);
          const doc = await Education.findByIdAndUpdate(id, raw, { new: true }).lean();
          if (!doc) return res.status(404).json({ error: "Not found" });
          return res.status(200).json(doc);
        }
        if (method === "DELETE") {
          if (!requireAdmin(req, res)) return;
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
        if (!requireAdmin(req, res)) return;
        const payload = aboutFromClient(req.body);
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
        if (!requireAdmin(req, res)) return;
        const payload = heroFromClient(req.body);
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
        if (!requireAdmin(req, res)) return;
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
