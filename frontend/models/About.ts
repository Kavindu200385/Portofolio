import mongoose, { Schema } from "mongoose";

const AboutSchema = new Schema(
  {
    paragraph1: { type: String },
    paragraph2: { type: String },
    paragraph3: { type: String },
    badges: [
      {
        id: { type: String },
        emoji: { type: String },
        label: { type: String },
      },
    ],
    profilePhoto: { type: String },
  },
  { collection: "about" },
);

export default mongoose.models.About || mongoose.model("About", AboutSchema);
