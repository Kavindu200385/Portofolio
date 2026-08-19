import mongoose, { Schema } from "mongoose";

const AboutSchema = new Schema(
  {
    name: { type: String },
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
    pullQuote: { type: String },
    credentialTitle: { type: String },
    credentialSubtitle: { type: String },
    resumeLink: { type: String },
    linkedinLink: { type: String },
  },
  { collection: "about" },
);

export default mongoose.models.About || mongoose.model("About", AboutSchema);
