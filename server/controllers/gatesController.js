import Gate from "../models/Gate.js";
import Site from "../models/Site.js";

// Get all gates
export const getAllGates = async (req, res) => {
  try {
    const gates = await Gate.find()
      .populate("site", "name location status") // Limit site fields to avoid circular data
      .populate("guards", "name email phone role status"); // ADD THIS - populate guards
    
    if (gates.length === 0) {
      return res.status(200).json({ message: "No gates found", total: 0, gates: [] });
    }
    
    return res.status(200).json({ total: gates.length, gates });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Get a single gate by ID
export const getGateById = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id)
      .populate("site", "name location status")
      .populate("guards", "name email phone role status"); // ADD THIS
    
    if (!gate) {
      return res.status(404).json({ message: "Gate not found" });
    }
    
    return res.status(200).json(gate);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Create a new gate
export const createGate = async (req, res) => {
  try {
    const { name, site, guards, status } = req.body;
    
    const gate = new Gate({ 
      name, 
      site, 
      status: status || "inactive",
      guards: guards || [] 
    });
    
    await gate.save();
    
    // Add the gate to the site's gates array
    // AND add the guards to the site's guards array (if not already there)
    await Site.findByIdAndUpdate(
      site,
      { 
        $push: { gates: gate._id },
        $addToSet: { guards: { $each: guards || [] } } // $addToSet prevents duplicates
      },
      { new: true }
    );

    // Populate both site AND guards before returning
    await gate.populate("site", "name location status");
    await gate.populate("guards", "name email phone role status");
    
    return res.status(201).json({ 
      message: "Gate created successfully.",
      gate 
    });
  } catch (err) {
    console.error("Error creating gate:", err);
    return res.status(400).json({ message: err.message });
  }
};

// Update a gate
export const updateGate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, site, status, guards } = req.body;
    
    const oldGate = await Gate.findById(id);
    if (!oldGate) {
      return res.status(404).json({ message: "Gate not found." });
    }
    
    // If site is being changed, update both old and new sites
    if (site && site !== oldGate.site.toString()) {
      // Remove from old site
      await Site.findByIdAndUpdate(
        oldGate.site,
        { $pull: { gates: oldGate._id } }
      );
      
      // Add to new site
      await Site.findByIdAndUpdate(
        site,
        { 
          $push: { gates: oldGate._id },
          $addToSet: { guards: { $each: guards || [] } }
        }
      );
      
      // Clean up old site's guards (remove guards that are no longer assigned to any gate)
      await cleanupSiteGuards(oldGate.site);
    } else {
      // Same site, just update the guards
      if (guards) {
        // Add new guards to site
        await Site.findByIdAndUpdate(
          site,
          { $addToSet: { guards: { $each: guards } } }
        );
        
        // Clean up guards no longer assigned to any gate in this site
        await cleanupSiteGuards(site);
      }
    }
    
    const updatedGate = await Gate.findByIdAndUpdate(
      id,
      { name, site, status, guards },
      { new: true }
    )
      .populate("site", "name location status")
      .populate("guards", "name email phone role status");
    
    return res.status(200).json({ 
      message: "Gate updated successfully.", 
      gate: updatedGate 
    });
    
  } catch (error) {
    console.error("Error updating gate:", error);
    return res.status(500).json({ 
      message: "Error updating gate.", 
      error: error.message 
    });
  }
};

// Helper function to clean up site guards
// Removes guards from site that are no longer assigned to any gate
const cleanupSiteGuards = async (siteId) => {
  try {
    // Get all gates for this site
    const gates = await Gate.find({ site: siteId });
    
    // Collect all unique guard IDs across all gates
    const allGuardIds = new Set();
    gates.forEach(gate => {
      gate.guards.forEach(guardId => {
        allGuardIds.add(guardId.toString());
      });
    });
    
    // Update the site with only the guards that are actually assigned
    await Site.findByIdAndUpdate(
      siteId,
      { guards: Array.from(allGuardIds) },
      { new: true }
    );
  } catch (error) {
    console.error("Error cleaning up site guards:", error);
  }
};

// Delete a gate
export const deleteGate = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id);
    
    if (!gate) {
      return res.status(404).json({ message: "Gate not found" });
    }
    
    // remove gate from site's gates array
    await Site.findByIdAndUpdate(
      gate.site,
      { $pull: { gates: gate._id } }
    );
    
    // Clean up site's guards after removing the gate
    await cleanupSiteGuards(gate.site);
    
    // Delete the gate
    await Gate.findByIdAndDelete(req.params.id);
    
    return res.status(200).json({ message: "Gate deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// get active gates
export const getActiveGates = async (req, res) => {
  try {
    const activeGates = await Gate.find({ status: "active" })
      .populate("site", "name location status")
      .populate("guards", "name email phone role status"); // ADD THIS
    
    if (activeGates.length === 0) {
      return res.status(200).json({ message: "No active gates found", total: 0, gates: [] });
    }
    
    return res.status(200).json({ total: activeGates.length, gates: activeGates });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// get inactive gates
export const getInactiveGates = async (req, res) => {
  try {
    const inactiveGates = await Gate.find({ status: "inactive" })
      .populate("site", "name location status")
      .populate("guards", "name email phone role status"); // ADD THIS
    
    if (inactiveGates.length === 0) {
      return res.status(200).json({ message: "No inactive gates found", total: 0, gates: [] });
    }
    
    return res.status(200).json({ total: inactiveGates.length, gates: inactiveGates });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};