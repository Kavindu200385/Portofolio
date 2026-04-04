import mongoose, { Schema } from "mongoose";

const EducationSchema = new Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    startMonth: { type: String },
    startYear: { type: String },
    endMonth: { type: String },
    endYear: { type: String },
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
    institutionLogo: { type: String },
    order: { type: Number, default: 0 },
  },
  { collection: "education" },
);

export default mongoose.models.Education || mongoose.model("Education", EducationSchema);
