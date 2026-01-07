import User from "../models/User.js";
import bcrypt from "bcryptjs";

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").lean();
  const total = await User.countDocuments();
  if (!users?.length)
    return res.status(404).json({ message: "No users found", total: 0 });
  res.json({ total, users });
};

const getOneUser = async (req, res) => {
  const { username, email, phone } = req.query;
  const orQuery = [];
  if (email) orQuery.push({ email });
  if (phone) orQuery.push({ phone: Number(phone) });
  if (username) orQuery.push({ username });

  if (orQuery.length === 0) {
    return res
      .status(400)
      .json({ message: "Provide username, email, or phone to search." });
  }

  const user = await User.findOne({ $or: orQuery }).select("-password").lean();
  if (!user)
    return res.status(404).json({ message: "User not found.", total: 0 });
  res.json({ total: 1, user });
};

// roles -> permissions mapping
const rolePermissions = {
  guard: [
    "users.read",
    "users.write",
    "visitors.read",
    "visitors.write",
    "sites.read",
    "gates.read",
    "guards.read",
    "assignments.read",
    "assignments.write",
    "logs.read",
  ],
  host: [
    "users.read",
    "users.write",
    "visitors.read",
    "visitors.write",
    "sites.read",
    "gates.read",
    "logs.read",
  ],
  admin: [
    "users.read",
    "users.write",
    "users.update",
    "users.delete",
    "visitors.read",
    "visitors.write",
    "visitors.update",
    "visitors.delete",
    "sites.read",
    "sites.write",
    "sites.update",
    "sites.delete",
    "gates.read",
    "gates.write",
    "gates.update",
    "gates.delete",
    "guards.read",
    "guards.write",
    "guards.update",
    "guards.delete",
    "assignments.read",
    "assignments.write",
    "assignments.update",
    "assignments.delete",
    "logs.read",
    "logs.export",
  ],
  manager: [
    "users.read",
    "users.write",
    "users.update",
    "visitors.read",
    "visitors.write",
    "visitors.update",
    "sites.read",
    "sites.write",
    "sites.update",
    "gates.read",
    "gates.write",
    "gates.update",
    "guards.read",
    "guards.write",
    "guards.update",
    "assignments.read",
    "assignments.write",
    "assignments.update",
    "logs.read",
    "logs.export",
  ],
  visitor: ["visitors.read", "sites.read", "gates.read", "logs.read"],
};
const createUser = async (req, res) => {
  const { username, password, email, phone, role } = req.body;
  if (!username || !password || !email || !phone)
    return res.status(400).json({
      message: "All fields (username, email, phone and password) are required.",
    });

  // check for duplicates
  const duplicateUsername = await User.findOne({ username }).lean().exec();
  if (duplicateUsername)
    return res.status(409).json({ message: "Username already exists." });
  const duplicateEmail = await User.findOne({ email }).lean().exec();
  if (duplicateEmail)
    return res.status(409).json({ message: "Email already exists." });
  const duplicatePhone = await User.findOne({ phone }).lean().exec();
  if (duplicatePhone)
    return res.status(409).json({ message: "Phone number already exists." });

  // hash password
  const hashedPwd = await bcrypt.hash(password, 12);

  // assign permissions based on role
  const permissions = rolePermissions[role] || rolePermissions["visitor"];

  const userObj = {
    username,
    email,
    phone,
    password: hashedPwd,
    role,
    permissions,
  };

  // create and store the new user
  const user = await User.create(userObj);

  if (user) {
    res.status(201).json({ message: "User created succesfully." });
  } else {
    res
      .status(400)
      .json({ message: "Error creating user. Invalid user data." });
  }
};

const updateUser = async (req, res) => {
  const { search, update } = req.body;
  if (!search || Object.keys(search).length === 0)
    return res
      .status(400)
      .json({ message: "Provide identifying field(s) in 'search'." });

  const user = await User.findOne(search).exec();
  if (!user) return res.status(404).json({ message: "User not found." });

  // Update only provided fields
  for (const [key, value] of Object.entries(update || {})) {
    if (key === "password") {
      user.password = await bcrypt.hash(value, 12);
    } else {
      user[key] = value;
    }
  }

  const updatedUser = await user.save();
  res.json({ message: `User ${updatedUser.username} updated successfully.` });
};

const deleteUser = async (req, res) => {
  const { username, email, phone } = req.body;

  const orQuery = [];
  if (username) orQuery.push({ username });
  if (email) orQuery.push({ email });
  if (phone) orQuery.push({ phone });

  if (orQuery.length === 0)
    return res
      .status(400)
      .json({ message: "User username, email or phone number required." });

  const user = await User.findOne({ $or: orQuery }).exec();
  if (!user) return res.status(404).json({ message: "User not found." });

  await User.deleteOne(user);
  res.json({ message: `User ${user.username} deleted.` });
};

export { getAllUsers, getOneUser, createUser, updateUser, deleteUser };
