import mongoose from "mongoose";

const SiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const siteSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
  },
  {
    timestamps: true,
  }
);

const Site = mongoose.model("Site", siteSchema);
export default Site;
