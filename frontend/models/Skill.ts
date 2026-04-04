import mongoose, { Schema } from "mongoose";

const SkillSchema = new Schema(
  {
    name: { type: String, required: true },
    icon: { type: String },
    category: { type: String, enum: ["Frontend", "Backend", "DevOps", "Tools"] },
    description: { type: String },
    proficiency: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    order: { type: Number, default: 0 },
    color: { type: String },
    size: { type: String, enum: ["normal", "wide"] },
  },
  { collection: "skills" },
);

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);
