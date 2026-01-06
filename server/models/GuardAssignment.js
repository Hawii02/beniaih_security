import mongoose from "mongoose";

const guardAssignmentSchema = new mongoose.Schema(
  {
    guard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guard",
      required: true,
    },
    site: { type: mongoose.Schema.Types.ObjectId, ref: "Site", required: true },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // who made the assignment
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date }, // null if currently assigned
    reason: { type: String }, // e.g. "transfer", "initial assignment", etc.
  },
  {
    timestamps: true,
  }
);

const GuardAssignment = mongoose.model(
  "GuardAssignment",
  guardAssignmentSchema
);
export default GuardAssignment;
