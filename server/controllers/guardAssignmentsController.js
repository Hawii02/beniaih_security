/*
===== Guard Assignments Controller =====

POST /assignments?siteId?guardId - Assign a guard to a site.
GET /assignments - List all guard assignments.
GET /assignments/:id - Get details of a specific guard assignment.
PATCH /assignments/:id - Update a guard assignment.
DELETE /assignments/:id - Remove a guard assignment.
GET /assignments/:guardId - List all assignments for a specific guard.
GET /assignments/:siteId - Get a specific site's assigned guards.
GET /assignments/active - List all currently active guard assignments.

=========================================
*/

import GuardAssignment from "../models/GuardAssignment.js";
import Guard from "../models/Guard.js";
import Site from "../models/Site.js";
import User from "../models/User.js";

// 1. Assign a guard to a site
export const assignGuardToSite = async (req, res) => {
  const { siteId, guardId } = req.params;
  const { assignedBy, startDate, endDate, reason } = req.body;
  // validate site and guard existence
  const existingGuard = await Guard.findById(guardId).exec();
  const existingSite = await Site.findById(siteId).exec();
  if (!existingGuard)
    return res.status(404).json({ message: "Guard not found" });
  if (!existingSite) return res.status(404).json({ message: "Site not found" });
  try {
    const newAssignment = new GuardAssignment({
      guard: guardId,
      site: siteId,
      assignedBy,
      startDate,
      endDate,
      reason,
    });
    await newAssignment.save();
    res.status(201).json({
      message: `Guard ${existingGuard.name} assigned to site ${existingSite.name} successfully.`,
      assignment: newAssignment,
    });
    if (!res.ok)
      return res.status(500).json({
        message: `Failed to assign guard ${existingGuard.name} to site ${existingSite.name}.`,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Error assigning guard ${existingGuard.name} to site ${existingSite.name}.`,
    });
  }
};

// 2. Get all guard assignments
export const getAllGuardAssignments = async (req, res) => {
  const assignments = await GuardAssignment.find();
  const total = await GuardAssignment.countDocuments();
  res.status(200).json({ total: total, assignments });
  if (!res.ok)
    return res.status(500).json({ message: "Error getting assignments." });
};

// 3. Get one guard assignment
export const getOneGuardAssignment = async (req, res) => {
  const { id } = req.params;
  const assignment = await GuardAssignment.findById(id).exec();
  if (!assignment)
    return res.status(404).json({ message: "Assignment not found." });
  res.status(200).json({ assignment });
  if (!res.ok)
    return res.status(500).json({ message: "Error getting assignment." });
};

// 4. Update guard assignment
export const updateGuardAssignment = async (req, res) => {
  const { id } = req.params;
  const assignment = await GuardAssignment.findById(id).exec();
  if (!assignment)
    return res.status(404).json({ message: "Assignment not found." });
  // update fields
  for (const key in req.body) {
    if (key !== "id" && req.body[key] !== undefined) {
      assignment[key] = req.body[key];
    }
  }
  await assignment.save();
  res
    .status(200)
    .json({ message: "Assignment updated successfully.", assignment });
  if (!res.ok)
    return res.status(500).json({ message: "Error updating assignment." });
};

// 5. Delete guard assignment
export const deleteGuardAssignment = async (req, res) => {
  const { id } = req.params;
  const assignment = await GuardAssignment.findById(id).exec();
  if (!assignment)
    return res.status(404).json({ message: "Assignment not found." });
  await assignment.deleteOne({ _id: id });
  res.status(200).json({ message: "Assignment deleted successfully." });
  if (!res.ok)
    return res.status(500).json({ message: "Error deleting assignment." });
};

// 6. Get all assignments for a specific guard
export const getAssignmentsForGuard = async (req, res) => {
  const { guardId } = req.params;
  const guard = await Guard.findById(guardId).exec();
  if (!guard) return res.status(404).json({ message: "Guard not found." });
  const assignments = await GuardAssignment.find({ guard: guardId }).exec();
  res
    .status(200)
    .json({ guard: guard.name, total: assignments.length, assignments });
  if (!res.ok)
    return res
      .status(500)
      .json({ message: `Error getting assignments for guard ${guard.name}.` });
};

// 7. Get all assigned guards for a specific site
export const getAssignedGuardsForSite = async (req, res) => {
  const siteId = req.params.siteId;
  const site = await Site.findById(siteId).exec();
  if (!site) return res.status(404).json({ message: "Site not found." });
  const assignments = await GuardAssignment.find({ site: siteId })
    .populate("guard")
    .exec();
  res
    .status(200)
    .json({ site: site.name, total: assignments.length, assignments });
  if (!res.ok)
    return res
      .status(500)
      .json({
        message: `Error getting assigned guards for site ${site.name}.`,
      });
};

// 8. Get all active guard assignments
export const getActiveGuardAssignments = async (req, res) => {
  const assignments = await GuardAssignment.find({
    endDate: { $exists: false },
  }).exec();
    res.status(200).json({ total: assignments.length, assignments });
    if (!res.ok)
        return res.status(500).json({ message: "Error getting active assignments." });
};
