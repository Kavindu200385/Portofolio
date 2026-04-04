// @ts-nocheck
import { connectDB } from "../../lib/mongodb";
import Skill from "../../models/Skill";
import { requireAdmin } from "../_helpers";
import { normalizeSkillBody } from "../_skillBody";

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    const id = req.query?.id;
    if (!id || typeof id !== "string") {
      return res.status(400).json({ error: "Missing id" });
    }
    if (req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      const raw = normalizeSkillBody(req.body);
      const doc = await Skill.findByIdAndUpdate(id, raw, { new: true }).lean();
      if (!doc) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(doc);
    }
    if (req.method === "DELETE") {
      if (!requireAdmin(req, res)) return;
      const doc = await Skill.findByIdAndDelete(id).lean();
      if (!doc) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(doc);
    }
    res.setHeader("Allow", ["PUT", "DELETE"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
