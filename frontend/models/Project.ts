import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["Individual", "Group", "Research"] },
    shortDescription: { type: String, maxlength: 150 },
    description: { type: String },
    mainPhoto: { type: String },
    additionalPhotos: [{ type: String }],
    githubLink: { type: String },
    liveDemoLink: { type: String },
    techStack: [{ type: String }],
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "projects" },
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
