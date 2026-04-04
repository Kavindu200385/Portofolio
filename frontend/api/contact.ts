// @ts-nocheck
import { connectDB } from "../lib/mongodb";
import Contact from "../models/Contact";
import { requireAdmin } from "./_helpers";

function contactFromClient(body: any) {
  if (!body || typeof body !== "object") return {};
  return {
    email: body.email ?? "",
    whatsapp: body.whatsapp ?? "",
    linkedin: body.linkedin ?? "",
    github: body.github ?? "",
    phone: body.phone ?? "",
    sectionHeading: body.sectionHeading ?? body.heading ?? "",
    sectionDescription: body.sectionDescription ?? body.description ?? "",
  };
}

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    if (req.method === "GET") {
      const doc = await Contact.findOne().lean();
      return res.status(200).json(doc);
    }
    if (req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      const payload = contactFromClient(req.body);
      const doc = await Contact.findOneAndUpdate({}, payload, { upsert: true, new: true }).lean();
      return res.status(200).json(doc);
    }
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
