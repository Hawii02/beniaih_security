
import Host from "../models/Host.js";
import Site from "../models/Site.js";

// 1. Assign a host to a site
export const createHost = async (req, res) => {
  try {
    const { name, idNumber, phoneNumber, email, unit, site } = req.body;
    
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
    });
    
    await newHost.save();
    
    // Add host to site's hosts array
    await Site.findByIdAndUpdate(
      site,
      { $push: { hosts: newHost._id } },
      { new: true }
    );
     // Populate the site before returning
    await newHost.populate('site');

    return res.status(201).json({
      message: `Host ${newHost.name} created successfully.`,
      host: newHost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error creating host.",
      error: error.message
    });
  }
};

// 2. Get all hosts
export const getAllHosts = async (req, res) => {
  try {
    const hosts = await Host.find();
    const total = await Host.countDocuments();
    res.status(200).json({ total: total, hosts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error getting hosts." });
  }
};

// 3. Get one host
export const getOneHost = async (req, res) => {
  try {
    const { id } = req.params;
    const host = await Host.findById(id).exec();
    if (!host) return res.status(404).json({ message: "Host not found." });
    res.status(200).json({ host });
  } catch (error) {
    console.error(error);
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
    ).populate("site");

    return res.status(200).json({ 
      message: "Host updated successfully.", 
      host: updatedHost 
    });
  } catch (error) {
    console.error(error);
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
        host.site, // Changed from host.assignedSite
        { $pull: { hosts: host._id } }
      );
    }
    
    // Delete host
    await Host.findByIdAndDelete(id);
    
    return res.status(200).json({ message: "Host deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      message: "Error deleting host.", 
      error: error.message 
    });
  }
};
// 