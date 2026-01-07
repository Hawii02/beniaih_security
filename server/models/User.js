import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["guard", "admin", "supervisor", "manager", "host", "visitor"],
      default: "visitor",
      required: true,
    },
    permissions: {
      type: [String],
      default: [], // -> read, write, update, delete
    },
  },
  {
    timestamps: true,
  }
);

// pre-save hook to hash password (must use regular function, not arrow)
userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return next();
  try {
    const salt = await bcryptjs.genSalt(12);
    this.password = await bcryptjs.hash(this.password, salt);
    // next();
  } catch (error) {
    console.log(error);
  }
});

// method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
