// @ts-nocheck
import { connectDB } from "../../lib/mongodb";
import Education from "../../models/Education";
import { requireAdmin } from "../_helpers";
import { educationFromClient } from "../_educationBody";

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    if (req.method === "GET") {
      const list = await Education.find().sort({ order: 1 }).lean();
      return res.status(200).json(list);
    }
    if (req.method === "POST") {
      if (!requireAdmin(req, res)) return;
      const raw = educationFromClient(req.body);
      const max = await Education.findOne().sort({ order: -1 }).select("order").lean();
      const nextOrder = (max?.order ?? -1) + 1;
      const doc = await new Education({ ...raw, order: raw.order || nextOrder }).save();
      return res.status(201).json(doc);
    }
    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
