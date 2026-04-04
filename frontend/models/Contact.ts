import mongoose, { Schema } from "mongoose";

const ContactSchema = new Schema(
  {
    email: { type: String },
    whatsapp: { type: String },
    linkedin: { type: String },
    github: { type: String },
    phone: { type: String },
    sectionHeading: { type: String },
    sectionDescription: { type: String },
  },
  { collection: "contacts" },
);

export default mongoose.models.Contact || mongoose.model("Contact", ContactSchema);
