// @ts-nocheck
import { connectDB } from "../../lib/mongodb";
import Project from "../../models/Project";
import { requireAdmin } from "../_helpers";

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    if (req.method !== "PUT") {
      res.setHeader("Allow", ["PUT"]);
      return res.status(405).json({ error: "Method not allowed" });
    }
    if (!requireAdmin(req, res)) return;
    const items = Array.isArray(req.body) ? req.body : req.body?.items;
    if (!Array.isArray(items)) {
      return res.status(400).json({ error: "Expected array of { id, order }" });
    }
    for (const row of items) {
      if (!row?.id) continue;
      await Project.findByIdAndUpdate(row.id, { $set: { order: row.order ?? 0 } });
    }
    const list = await Project.find().sort({ featured: -1, order: 1 }).lean();
    return res.status(200).json(list);
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
