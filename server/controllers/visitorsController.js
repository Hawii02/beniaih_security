/*
===== ENDPOINTS =====
1. Create visitors
- POST /visitors [DONE + ENDPOINT]

2 Visitor Status Update
- PATCH /visitors/:id/arrived [DONE + ENDPOINT]
- PATCH /visitors/:id/departed [DONE + ENDPOINT]

3. Visitor Retrieval and History
- GET /visitors [DONE + ENDPOINT]
- GET /visitors/:id[DONE + ENDPOINT]
- GET /visitors/history?host=...?site=...?date=...[DONE + ENDPOINT]

4. Analytics and Reporting
- GET /visitors/analytics/daily-count [DONE]
- GET /visitors/analytics/peak-hours [DONE]
- GET /visitors/analytics/frequent-visitors [DONE]

5. Delete and Update Visitors
- DELETE /visitors/:id [DONE + ENDPOINT]
- PATCH /visitors/:id [DONE + ENDPOINT]

|| - WORKFLOW - ||
CRUD operations for visitor management, including status updates, retrieval with filters, analytics, and deletion.

====================
*/

import Visitor from "../models/Visitor.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// 1. Create Visitor
export const createVisitor = async (req, res) => {
  const { name, idNumber, purpose, vehicleReg, expectedTime, hostId, siteId } =
    req.body;
  if (!name || !idNumber || !purpose || !expectedTime || !hostId || !siteId) {
    return res
      .status(400)
      .json({ message: "All required fields must be provided." });
  }

  try {
    // check for duplicates
    const duplicateVisitorName = await User.findOne({ name }).lean().exec();
    if (duplicateVisitorName)
      return res.status(409).json({ message: "Name already exists." });
    const duplicateIdNumber = await User.findOne({ idNumber }).lean().exec();
    if (duplicateIdNumber)
      return res.status(409).json({ message: "ID Number already exists." });

    // create visitor
    const newVisitor = new Visitor({
      name,
      idNumber,
      purpose,
      vehicleReg,
      expectedTime,
      host: mongoose.Types.ObjectId(hostId),
      site: mongoose.Types.ObjectId(siteId),
    });

    const createdUser = await newVisitor.save();

    if (createdUser) {
      res.status(201).json({ message: "Visitor created successfully." });
    } else {
      res.status(400).json({ message: "Error creating visitor." });
    }
  } catch (error) {
    console.log(error);
  }
};

// 2. Read/Get All Visitors
export const getAllVisitors = async (req, res) => {
  try {
    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Visitor.countDocuments();
    const visitors = await Visitor.find()
      .skip(skip)
      .limit(limit)
      .sort({ arrivalTime: -1 });

    if (!visitors?.length)
      return res.status(200).json({ message: "No visitors found", total: 0 });

    res.status(200).json({
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      visitors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving visitors." });
  }
};

// 3. Read/Get One Visitor
export const getOneVisitor = async (req, res) => {
  const { id } = req.body;
  try {
    if (!id) return res.status(400).json({ message: "Visitor ID required." });
    const visitor = await Visitor.findById(id).exec();
    if (!visitor) return res.status(404).json({ message: "User not found." });
    res.status(200).json({ total: 1, visitor });
  } catch (error) {
    console.log(error);
  }
};

// 4. Update Visitor
export const updateVisitor = async (req, res) => {
  const { id } = req.body;

  const foundVisitor = await Visitor.findById(id).exec();
  if (!foundVisitor)
    return res.status(404).json({ message: "Visitor not found." });

  // update fields
  for (const key in req.body) {
    if (key !== "id" && req.body[key] !== undefined) {
      foundVisitor[key] = req.body[key];
    }
  }

  const updatedVisitor = await foundVisitor.save();
  if (!updatedVisitor)
    return res.status(400).json({ message: "Error updating visitor." });
  res
    .status(200)
    .json({ message: `Visitor ${updatedVisitor.name} updated successfully.` });
};

// 5. Delete visitor
export const deleteVisitor = async (req, res) => {
  const { id } = req.body;

  const foundVisitor = await Visitor.findById(id).exec();
  if (!foundVisitor)
    return res.status(404).json({ message: "Visitor not found." });

  await Visitor.deleteOne(foundVisitor);
  res.status(200).json({ message: "Visitor deleted successfully." });

  if (!res.ok)
    return res.status(400).json({ message: "Error deleting visitor." });
};

// 6. Visitor arrived status update
export const markVisitorArrived = async (req, res) => {
  const { id } = req.body;

  const arrivedUser = await Visitor.findById(id).exec();
  if (!arrivedUser) res.status(404).json({ message: "Visitor not found." });

  arrivedUser.status = "arrived";
  arrivedUser.arrivalTime = new Date();
  const updatedVisitor = await arrivedUser.save();
  if (!updatedVisitor)
    res.status(400).json({ message: "Error updating visitor arrived status." });
  res.status(201).json({
    message: `Visitor ${updatedVisitor.name} arrived status updated succesfully.`,
  });
};

// 7. Visitor departed status update
export const markVisitorDeparted = async (req, res) => {
  const { id } = req.body;

  const departedUser = await Visitor.findById(id).exec();
  if (!departedUser) res.status(404).json({ message: "Visitor not found." });

  departedUser.status = "departed";
  departedUser.arrivalTime = new Date();
  const updatedVisitor = await departedUser.save();
  if (!updatedVisitor)
    res
      .status(400)
      .json({ message: "Error updating visitor departed status." });
  res.status(201).json({
    message: `Visitor ${updatedVisitor.name} departed status updated succesfully.`,
  });
};

// 8. Visitors' history retrieval
export const getVisitorsHistory = async (req, res) => {
  try {
    const { host, site, date } = req.query;
    let filter = {};

    if (host) filter.host = host;
    if (site) filter.site = site;
    if (date) {
      // assuming date is in YYMMDD format
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.arrivalTime = { $gte: start, $lt: end };
    }

    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Visitor.countDocuments(filter);
    const visitors = await Visitor.find(filter)
      .populate("host", "username email")
      .populate("site", "name location")
      .sort({ arrivalTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit)),
      visitors,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving visitors history." });
  }
};

// 9. Daily visitor count analytics
export const getDailyVisitorsCount = async (req, res) => {
  try {
    const { start, end } = req.query;
    let match = {};

    if (start && end) {
      match.arrivalTime = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const dailyCounts = await Visitor.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$arrivalTime" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({ dailyCounts });

    if (!res.ok)
      return res
        .status(400)
        .json({ message: "Error retrieving daily visitors count." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving daily visitors count." });
  }
};

// 10. Peak visitor hours count analytics
export const getPeakVisitorHours = async (req, res) => {
  try {
    const { start, end } = req.query;
    let match = {};

    if (start && end) {
      match.arrivalTime = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const hourlyCounts = await Visitor.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            $hour: "$arrivalTime",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: 1 } },
    ]);

    // Optionally find the peak hour(s)
    const peakCount = hourlyCounts.length ? hourlyCounts[0].count : 0;
    const peakHours = hourlyCounts.filter((hour) => hour.count === peakCount);

    res.status(200).json({ hourlyCounts, peakHours, peakCount });

    if (!res.ok)
      return res
        .status(400)
        .json({ message: "Error retrieving daily visitors count." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving daily visitors count." });
  }
};

// 11. Frequent visitors analytics
export const getFrequentVisitors = async (req, res) => {
  // optionally filter by site, host, or date range
  try {
    const { site, host, start, end } = req.query;
    let match = {};
    if (site) match.site = site;
    if (host) match.host = host;
    if (start && end) {
      match.arrivalTime = {
        $gte: new Date(start),
        $lte: new Date(end),
      };
    }

    const frequentVisitors = await Visitor.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$idNumber",
          name: { $first: "$name" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 }, // top 10 frequent visitors
    ]);

    res.status(200).json({ frequentVisitors });
    if (!res.ok)
      return res
        .status(400)
        .json({ message: "Error retrieving frequent visitors." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving frequent visitors." });
  }
};
