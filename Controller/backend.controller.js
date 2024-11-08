import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import Backend from "../Models/BackendData/Backend.model.js";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

dotenv.config({
  path: "./env",
});

const backendExists = async (referralId) => {
  const existingBackend = await Backend.findOne({ referralId });
  return existingBackend !== null;
};

// Middleware for authentication
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWTSECRET);
    req.backend = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export const backendLogin = async (req, res) => {
  try {
    const { referralId, password } = req.body;

    // Check if backend user exists
    const backend = await Backend.findOne({ referralId });
    if (!backend) {
      return res
        .status(400)
        .json({ message: "Backend user does not exist. Contact your Admin!" });
    }

    // Compare the hashed password
    const isPasswordMatch = await backend.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    backend.isLogin = true;
    await backend.save();

    // Generate JWT token with expiry time
    const token = jwt.sign(
      { referralId: backend.referralId, role: "backend" }, // Payload
      process.env.JWTSECRET // JWT secret key
    );

    // Respond with token and backend ID
    res.status(200).json({
      token,
      ID: backend._id,
      role: "backend",
      referralId: backend.referralId,
    });
    // console.log("Backend user logged in successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const backendSignup = async (req, res) => {
  try {
    const { Name, password, referralId, Phone, position } = req.body;
    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    let uploadedAadhaar;
    let uploadedPanCard;
    if (aadhaarImage) {
      console.log("Uploading Aadhaar image...");
      uploadedAadhaar = await uploadOnCloudinary(aadhaarImage);
      console.log("Aadhaar image uploaded:", uploadedAadhaar.url);
    }
    if (panCardImage) {
      console.log("Uploading Pan Card image...");
      uploadedPanCard = await uploadOnCloudinary(panCardImage);
      console.log("Pan Card image uploaded:", uploadedPanCard.url);
    }

    // Check if user already exists
    if (await backendExists(referralId)) {
      return res.status(400).json({ message: "Backend already exists" });
    }

    // Hash password for security
    const hashedPassword = await Backend.hashPassword(password);

    // Create new user
    const backend = new Backend({
      referralId,
      Name,
      password: hashedPassword,
      Phone,
      position,
      aadhaarImage: uploadedAadhaar?.url,
      panCardImage: uploadedPanCard?.url,
    });

    await backend.save();

    res.status(201).json({ message: "backend created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const backendLogout = async (req, res) => {
  try {
    const { referralId } = req.body;

    if (!referralId) {
      return res.status(400).json({ message: "Referral ID is required" });
    }

    console.log("Logging out backend:", referralId);

    // Find the backendq   by referralId (not by ObjectId)
    const backend = await Backend.findOne({ referralId });

    if (!backend) {
      return res.status(404).json({ message: "Backend not found" });
    }

    // Update the backend's login status
    backend.isLogin = false; // Set to boolean false for logout
    await backend.save();

    console.log("Backend updated:", backend);
    res.status(200).json({
      message: "Backend logged out successfully",
      isLogin: backend.isLogin,
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  backendLogin,
  verifyToken,
  backendSignup,
};
