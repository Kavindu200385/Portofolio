import mongoose, { Schema } from "mongoose";

const HeroSchema = new Schema(
  {
    mainHeading: { type: String },
    subHeading: { type: String },
    cta1Label: { type: String },
    cta1Link: { type: String },
    cta2Label: { type: String },
    cta2Link: { type: String },
    heroPhoto: { type: String },
  },
  { collection: "hero" },
);

export default mongoose.models.Hero || mongoose.model("Hero", HeroSchema);
