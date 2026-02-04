import Guard from "../models/Guard.js";
import Gate from "../models/Gate.js";
import Visitor from "../models/Visitor.js";
import Site from "../models/Site.js";

// 1. Create a new guard
export const createGuard = async (req, res) => {
  try {
    const { name, idNumber, phoneNumber, email, role, status } = req.body;
    
    if (!name || !idNumber || !phoneNumber || !email) {
      return res.status(400).json({
        message: "Name, ID number, phone number, and email are required.",
      });
    }
    
    const newGuard = new Guard({ 
      name, 
      idNumber, 
      phoneNumber, 
      email,
      role: role || "guard",
      status: status || "inactive"
    });
    
    await newGuard.save();
    
    return res.status(201).json({ 
      message: "Guard created successfully.", 
      guard: newGuard 
    });
  } catch (error) {
    console.error("Error creating guard:", error);
    return res.status(500).json({ message: "Error creating guard." });
  }
};

// 2. Get all guards
export const getAllGuards = async (req, res) => {
  try {
    const guards = await Guard.find();
    const total = await Guard.countDocuments();
    
    return res.status(200).json({ total, guards });
  } catch (error) {
    console.error("Error retrieving guards:", error);
    return res.status(500).json({ message: "Error retrieving guards." });
  }
};

// 3. Get one guard
export const getOneGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const guard = await Guard.findById(id);
    
    if (!guard) {
      return res.status(404).json({ message: "Guard not found." });
    }
    
    return res.status(200).json({ guard });
  } catch (error) {
    console.error("Error retrieving guard:", error);
    return res.status(500).json({ message: "Error retrieving guard." });
  }
};

// 4. Update guard
export const updateGuard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, idNumber, phoneNumber, email, role, status } = req.body;
    
    const guard = await Guard.findById(id);
    if (!guard) {
      return res.status(404).json({ message: "Guard not found." });
    }

    const updatedGuard = await Guard.findByIdAndUpdate(
      id, 
      { name, idNumber, phoneNumber, email, role, status },
      { new: true }
    );

    return res.status(200).json({ 
      message: "Guard updated successfully.", 
      guard: updatedGuard 
    });
  } catch (error) {
    console.error("Error updating guard:", error);
    return res.status(500).json({ 
      message: "Error updating guard.", 
      error: error.message 
    });
  }
};

// 5. Delete guard
export const deleteGuard = async (req, res) => {
  try {
    const { id } = req.params;
    
    const guard = await Guard.findById(id);
    if (!guard) {
      return res.status(404).json({ message: "Guard not found." });
    }
    
    // Remove guard from all gates
    await Gate.updateMany(
      { guards: id },
      { $pull: { guards: id } }
    );
    
    // Get all sites that have this guard
    const sites = await Site.find({ guards: id });
    
    // For each site, clean up the guards array
    for (const site of sites) {
      await cleanupSiteGuards(site._id);
    }
    
    // Delete the guard
    await Guard.findByIdAndDelete(id);
    
    return res.status(200).json({ message: "Guard deleted successfully." });
  } catch (error) {
    console.error("Error deleting guard:", error);
    return res.status(500).json({ 
      message: "Error deleting guard.", 
      error: error.message 
    });
  }
};

// Helper function to clean up site guards (same as in Gate controller)
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

// 6. List gates assigned to a guard
export const getGatesForGuard = async (req, res) => {
  try {
    const { id } = req.params;
    
    const gates = await Gate.find({ guards: id })
      .populate("site", "name location status");
    
    return res.status(200).json({ total: gates.length, gates });
  } catch (error) {
    console.error("Error retrieving gates for guard:", error);
    return res.status(500).json({ message: "Error retrieving gates for guard." });
  }
};

// 7. Update guard status
export const updateGuardStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const guard = await Guard.findById(id);
    if (!guard) {
      return res.status(404).json({ message: "Guard not found." });
    }
    
    guard.status = status;
    await guard.save();
    
    return res.status(200).json({ message: "Guard status updated.", guard });
  } catch (error) {
    console.error("Error updating guard status:", error);
    return res.status(500).json({ message: "Error updating guard status." });
  }
};

// 8. Guard assignment/activity history
export const getGuardHistory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const gates = await Gate.find({ guards: id })
      .populate("site", "name location");
    const visitorLogs = await Visitor.find({ guard: id });
    
    return res.status(200).json({ gates, visitorLogs });
  } catch (error) {
    console.error("Error retrieving guard history:", error);
    return res.status(500).json({ message: "Error retrieving guard history." });
  }
};

// 9. Guard analytics (e.g., visitors processed)
export const getGuardAnalytics = async (req, res) => {
  try {
    const { id } = req.params;
    const visitorCount = await Visitor.countDocuments({ guard: id });
    
    return res.status(200).json({ guardId: id, visitorCount });
  } catch (error) {
    console.error("Error retrieving guard analytics:", error);
    return res.status(500).json({ message: "Error retrieving guard analytics." });
  }
};

// 10. Export guard logs (CSV/PDF)
export const exportGuardLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const { format } = req.query;
    
    const logs = await Visitor.find({ guard: id }).lean();
    
    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: "No logs found for this guard." });
    }
    
    if (format === "csv") {
      const { Parser } = await import("json2csv");
      const fields = [
        "_id",
        "name",
        "status",
        "createdAt",
        "updatedAt",
        "gate",
        "site",
        "guard",
      ];
      const opts = { fields };
      const parser = new Parser(opts);
      const csv = parser.parse(logs);
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="guard_${id}_logs.csv"`,
      );
      return res.status(200).send(csv);
    } else if (format === "pdf") {
      const PDFDocument = (await import("pdfkit")).default;
      const doc = new PDFDocument();
      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename="guard_${id}_logs.pdf"`,
        );
        res.status(200).send(pdfData);
      });
      doc.fontSize(18).text(`Logs for Guard: ${id}`, { align: "center" });
      doc.moveDown();
      logs.forEach((log, idx) => {
        doc.fontSize(12).text(`Visitor #${idx + 1}`);
        Object.entries(log).forEach(([key, value]) => {
          doc.text(`${key}: ${value}`);
        });
        doc.moveDown();
      });
      doc.end();
    } else {
      return res.status(400).json({ 
        message: "Invalid format. Use 'csv' or 'pdf'." 
      });
    }
  } catch (error) {
    console.error("Error exporting guard logs:", error);
    return res.status(500).json({ message: "Error exporting guard logs." });
  }
};