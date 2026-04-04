// @ts-nocheck
import { connectDB } from "../lib/mongodb";
import Hero from "../models/Hero";
import { requireAdmin } from "./_helpers";

function heroFromClient(body: any) {
  if (!body || typeof body !== "object") return {};
  return {
    mainHeading: body.mainHeading ?? body.heading ?? "",
    subHeading: body.subHeading ?? "",
    cta1Label: body.cta1Label ?? "",
    cta1Link: body.cta1Link ?? "",
    cta2Label: body.cta2Label ?? "",
    cta2Link: body.cta2Link ?? "",
    heroPhoto: body.heroPhoto ?? "",
  };
}

export default async function handler(req: any, res: any) {
  try {
    await connectDB();
    if (req.method === "GET") {
      const doc = await Hero.findOne().lean();
      return res.status(200).json(doc);
    }
    if (req.method === "PUT") {
      if (!requireAdmin(req, res)) return;
      const payload = heroFromClient(req.body);
      const doc = await Hero.findOneAndUpdate({}, payload, { upsert: true, new: true }).lean();
      return res.status(200).json(doc);
    }
    res.setHeader("Allow", ["GET", "PUT"]);
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
