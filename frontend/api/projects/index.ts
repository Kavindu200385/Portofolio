// @ts-nocheck
import { connectDB } from "../../lib/mongodb";
import Project from "../../models/Project";
import { requireAdmin } from "../_helpers";
import { normalizeProjectBody } from "../_projectBody";

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    if (req.method === "GET") {
      const list = await Project.find().sort({ featured: -1, order: 1 }).lean();
      return res.status(200).json(list);
    }
    if (req.method === "POST") {
      if (!requireAdmin(req, res)) return;
      const raw = normalizeProjectBody(req.body);
      const max = await Project.findOne().sort({ order: -1 }).select("order").lean();
      const nextOrder = (max?.order ?? -1) + 1;
      const doc = await new Project({ ...raw, order: raw.order || nextOrder }).save();
      return res.status(201).json(doc);
    }
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
