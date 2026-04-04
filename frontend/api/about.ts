// @ts-nocheck
import { connectDB } from "../lib/mongodb";
import About from "../models/About";
import { requireAdmin } from "./_helpers";

function aboutFromClient(body: any) {
  if (!body || typeof body !== "object") return {};
  if (Array.isArray(body.paragraphs)) {
    return {
      paragraph1: body.paragraphs[0] ?? "",
      paragraph2: body.paragraphs[1] ?? "",
      paragraph3: body.paragraphs[2] ?? "",
      badges: body.badges ?? [],
      profilePhoto: body.profilePhoto ?? "",
    };
  }
  return {
    paragraph1: body.paragraph1 ?? "",
    paragraph2: body.paragraph2 ?? "",
    paragraph3: body.paragraph3 ?? "",
    badges: body.badges ?? [],
    profilePhoto: body.profilePhoto ?? "",
  };
}

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    if (req.method === "GET") {
      const doc = await About.findOne().lean();
      return res.status(200).json(doc);
    }
    if (req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      const payload = aboutFromClient(req.body);
      const doc = await About.findOneAndUpdate({}, payload, { upsert: true, new: true }).lean();
      return res.status(200).json(doc);
    }
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
