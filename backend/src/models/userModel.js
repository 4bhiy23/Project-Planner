import mongoose from "mongoose"
import bcrypt from 'bcrypt'
import { ApiError } from '../utils/ApiErrors.js'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user"
  },
  refreshToken: {
    type: String
  }
}, { timestamps: true });

// Middleware to hash password before storing it in DB
userSchema.pre("save", async function () {
  // If the password field is not updated this middleware does not run
  if (!this.isModified("password")) return
  try {
    this.password = await bcrypt.hash(this.password, 12)
  } catch (error) {
    throw new ApiError(500, "Failed to hash password")
  }
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign({
    _id: this._id,
    username: this.username,
    role: this.role
  },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  )
}

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign({
    _id: this._id
  },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  )
}

export const User = mongoose.model("User", userSchema);