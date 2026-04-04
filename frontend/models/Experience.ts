import mongoose, { Schema } from "mongoose";

const ExperienceSchema = new Schema(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    startMonth: { type: String },
    startYear: { type: String },
    endMonth: { type: String },
    endYear: { type: String },
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
    companyLogo: { type: String },
    order: { type: Number, default: 0 },
  },
  { collection: "experiences" },
);

export default mongoose.models.Experience || mongoose.model("Experience", ExperienceSchema);
