// @ts-nocheck
import { connectDB } from "../../lib/mongodb";
import Experience from "../../models/Experience";
import { requireAdmin } from "../_helpers";
import { experienceFromClient } from "../_experienceBody";

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    if (req.method === "GET") {
      const list = await Experience.find().sort({ order: 1 }).lean();
      return res.status(200).json(list);
    }
    if (req.method === "POST") {
      if (!requireAdmin(req, res)) return;
      const raw = experienceFromClient(req.body);
      const max = await Experience.findOne().sort({ order: -1 }).select("order").lean();
      const nextOrder = (max?.order ?? -1) + 1;
      const doc = await new Experience({ ...raw, order: raw.order || nextOrder }).save();
      return res.status(201).json(doc);
    }
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
