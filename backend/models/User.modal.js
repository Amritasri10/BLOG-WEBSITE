import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    // ── Role ────────────────────────────────────────────────────────────────
    // User   → sirf blogs padhta hai, comment karta hai
    // Author → blogs likhta hai, apne blogs manage karta hai
    // Admin  → sab kuch manage karta hai
    role: {
      type: String,
      enum: ["User", "Author", "Admin"],
      default: "User",
      required: true,
    },

    // ── Common Fields ────────────────────────────────────────────────────────
    profilePic: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      trim: true,
      default: "",
    },

    // ── Author specific ──────────────────────────────────────────────────────
    // sirf Authors ke blogs ki list
    blogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],

    // ── User specific ────────────────────────────────────────────────────────
    // User ke saved/liked blogs aur followed authors
    savedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    likedBlogs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
      },
    ],
    followingAuthors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// ── JWT Token Generate ───────────────────────────────────────────────────────
UserSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: "365d" }
  );
};

export default mongoose.model("User", UserSchema);
