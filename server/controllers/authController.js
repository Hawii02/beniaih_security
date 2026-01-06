import dotenv from "dotenv";
import jsonwebtoken from "jsonwebtoken";
import User from "../models/User.js";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;

const loginUser = async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    // allow login by either email or phone
     let user = await User.findOne({ $or: [{ email }, { phone }] });

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

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const registerUser = async (req, res) => {
  const { email, phone, password, username } = req.body;

  try {
    // Check if user exists by email or phone or username
    let user = await User.findOne({ $or: [{ email }, { phone }, { username }] });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      email,
      password,
      phone,
      username,
    });

    await user.save();
  } catch (e) {
    console.log(e.message);
  }
};

export { loginUser, registerUser };
