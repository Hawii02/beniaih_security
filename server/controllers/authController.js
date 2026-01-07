import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/User.js";
import { rolePermissions } from "../utils.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const loginUser = async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    let user = null;
    if (email) {
      user = await User.findOne({ email });
    } else if (phone) {
      user = await User.findOne({ phone });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jsonwebtoken.sign(payload, jwtSecret, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const registerUser = async (req, res) => {
  const { email, phone, password, username } = req.body;

  try {
    // Check if user exists by email or phone or username
    let user = await User.findOne({
      $or: [{ email }, { phone }, { username }],
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const role = 'visitor' // default role
    user = new User({
      email,
      password,
      phone,
      username,
      role,
      permissions: rolePermissions[role] || rolePermissions["visitor"], // default to visitor permissions
    });

    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (e) {
    console.log(e.message);
    res.status(500).send("Error registering user.");
  }
};

const logout = async (req, res) => {
  // Since JWTs are stateless, logout can be handled on the client side by deleting the token.
  res.json({ message: "User logged out successfully" });
};

export { loginUser, registerUser, logout };
