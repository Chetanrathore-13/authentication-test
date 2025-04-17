import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import dotenv from "dotenv";
import axios from "axios";
import { oauth2Client } from "../utils/googleConfig.js";
dotenv.config();

// Generate Tokens
const generateAccessToken = (user) => {
    console.log( process.env.ACCESS_TOKEN_SECRET, process.env.ACCESS_TOKEN_EXPIRY)
  return jwt.sign(
    { id: user._id, name: user.name },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY } // e.g., 15m
  );
};

const generateRefreshToken = (user) => {
    console.log( process.env.REFRESH_TOKEN_SECRET, process.env.REFRESH_TOKEN_EXPIRY)
  return jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY } // e.g., 7d
  );
};

// Register
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    console.log("yha tak agya")
    console.log(user)
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    console.log("yha tak agya1")
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    console.log("yha tak agya2")
    res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();
    
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });
    
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

export const googleLogin = async (req, res) => {
  try {
    console.log("Google login request received:", req.body);
    const { code } = req.body;

    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    console.log("Google tokens received:", tokens);
    oauth2Client.setCredentials(tokens);

    // Get user info from Google
    const userRes = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`
    );

    const { email, name } = userRes.data;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ email, name });
    }

    const { _id } = user;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Google login successful",
      user: { id: _id, name, email },
    });
  } catch (error) {
    console.error("Google login error:", error.response?.data || error.message);
    res.status(500).json({ message: "Google login failed", error: error.message });
  }
};


// Logout
export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

// Get Profile (Protected)
export const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json({ user });
    } catch (err) {
      res.status(500).json({ message: "Failed to get profile", error: err.message });
    }
  };
  
