import Host from "../models/Host.js";
import Site from "../models/Site.js";

// 1. Assign a host to a site
export const createHost = async (req, res) => {
  try {
    const { name, idNumber, phoneNumber, email, unit, site, status } = req.body;
    
    // Validate site exists
    const existingSite = await Site.findById(site);
    if (!existingSite) {
      return res.status(404).json({ message: "Site not found" });
    }

    const newHost = new Host({
      name,
      site,
      idNumber,
      phoneNumber,
      email,
      unit,
      status: status || "inactive"
    });
    
    await newHost.save();
    
    // Add host to site's hosts array
    await Site.findByIdAndUpdate(
      site,
      { $push: { hosts: newHost._id } },
      { new: true }
    );
    
    // Populate the site before returning (with limited fields)
    await newHost.populate('site', 'name location status');

    return res.status(201).json({
      message: `Host ${newHost.name} created successfully.`,
      host: newHost,
    });
  } catch (error) {
    console.error("Error creating host:", error);
    return res.status(500).json({
      message: "Error creating host.",
      error: error.message
    });
  }
};

// 2. Get all hosts
export const getAllHosts = async (req, res) => {
  try {
    const hosts = await Host.find()
      .populate('site', 'name location status'); // Only populate needed fields
    const total = await Host.countDocuments();
    
    return res.status(200).json({ total, hosts });
  } catch (error) {
    console.error("Error getting hosts:", error);
    return res.status(500).json({ message: "Error getting hosts." });
  }
};

// 3. Get one host
export const getOneHost = async (req, res) => {
  try {
    const { id } = req.params;
    const host = await Host.findById(id)
      .populate('site', 'name location status');
    
    if (!host) {
      return res.status(404).json({ message: "Host not found." });
    }
    
    return res.status(200).json({ host });
  } catch (error) {
    console.error("Error getting host:", error);
    return res.status(500).json({ message: "Error getting host." });
  }
};

// 4. Update host
export const updateHost = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, idNumber, phoneNumber, email, unit, site, status } = req.body;
    
    const oldHost = await Host.findById(id);
    if (!oldHost) {
      return res.status(404).json({ message: "Host not found." });
    }

    // If site is being changed, update both old and new sites
    if (site && site !== oldHost.site?.toString()) {
      // Remove from old site
      if (oldHost.site) {
        await Site.findByIdAndUpdate(
          oldHost.site,
          { $pull: { hosts: oldHost._id } }
        );
      }
      
      // Add to new site
      await Site.findByIdAndUpdate(
        site,
        { $push: { hosts: oldHost._id } }
      );
    }

    const updatedHost = await Host.findByIdAndUpdate(
      id,
      { name, idNumber, phoneNumber, email, unit, site, status },
      { new: true }
    ).populate("site", "name location status"); // Only populate needed fields

    return res.status(200).json({ 
      message: "Host updated successfully.", 
      host: updatedHost 
    });
  } catch (error) {
    console.error("Error updating host:", error);
    return res.status(500).json({ 
      message: "Error updating host.", 
      error: error.message 
    });
  }
};

// 5. Delete host
export const deleteHost = async (req, res) => {
  try {
    const { id } = req.params;
    
    const host = await Host.findById(id);
    if (!host) {
      return res.status(404).json({ message: "Host not found." });
    }
    
    // Remove host from site's hosts array
    if (host.site) {
      await Site.findByIdAndUpdate(
        host.site,
        { $pull: { hosts: host._id } }
      );
    }
    
    // Delete host
    await Host.findByIdAndDelete(id);
    
    return res.status(200).json({ message: "Host deleted successfully." });
  } catch (error) {
    console.error("Error deleting host:", error);
    return res.status(500).json({ 
      message: "Error deleting host.", 
      error: error.message 
    });
  }
};