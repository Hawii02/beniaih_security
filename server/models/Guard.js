import mongoose from "mongoose";

const guardSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    idNumber: { type: String, required: true }, // National ID or employee number
    contact: { type: String },
    assignedSite: { type: mongoose.Schema.Types.ObjectId, ref: "Site" },
    status: {
      type: String,
      enum: ["active", "inactive", "on-leave", "transferred"],
      default: "active",
    },
    hireDate: { type: Date },
    photoUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

const Guard = mongoose.model("Guard", guardSchema);
export default Guard;
