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

export const backendDetail = async (req, res) => {
  try {
    const { _id } = req.query;

    let backend = await Backend.findOne({ _id });

    if (!backend) {
      return res.status(404).json({
        message: "No Agent found",
      });
    }

    res.status(200).json({ backend });
  } catch (error) {
    console.error("Error getting backend details", error);
    return res.status(401).json({
      message: "Error fetching data of backend",
      error: error.message,
    });
  }
};

export const backendDelete = async (req, res) => {
  const backendId = req.query._id;
  try {
    const backendDelete = await Backend.findByIdAndDelete(backendId);

    if (!backendDelete) {
      return res.status(404).json({
        message: "Backend no found",
      });
    }
    console.log("Backend Deleted");
    return res.status(200).json({
      message: "backend Deleted",
    });
  } catch (error) {
    return res.status(500).json({
      error: "an error occure while deleting agent",
    });
  }
};

export const allBackends = async (req, res) => {
  try {
    const backend = await Backend.find({});
    const allBackend = backend.map((backend) => ({
      _id: backend._id,
      referralId: backend.referralId,
      Name: backend.Name,
      isLogin: backend.isLogin,
      position: backend.position,
      profileImage: backend.profileImage,
    }));
    // console.log("Sending allBackend:", allBackend);
    return res.status(200).json({ allBackend });
  } catch (error) {
    console.error("Error fetching backend", error.message);
    return res.status(500).json({
      message: "Error fetching backendList",
      error: error.message,
    });
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

export const backendKYCStatus = async (req, res) => {
  try {
    const { id: BACKENDID } = req.params; // Access AGENTID from params

    // console.log("Fetching KYC status for agent ID:", AGENTID); // Log the ID being searched

    const agent = await Backend.findOne({ _id: BACKENDID }); // Use AGENTID directly
    if (!agent) {
      return res.status(404).json({ message: "Backend not found" });
    }
    res.status(200).json({ isKYCVerified: agent.isKYCVerified });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const backendKYC = async (req, res) => {
  try {
    const { BACKENDID } = req.body;
    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    const resumeImage = req.files?.resumeImage?.[0];
    const profileImage = req.files?.profileImage?.[0];
    // const otherImage = req.files?.otherImage?.[0];

    // Initialize variables for uploaded images
    let uploadedAadhaar, uploadedPanCard, uploadedResume, uploadedProfile;
    // uploadedOther;

    // Check for each file individually and upload
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
    if (resumeImage) {
      console.log("Uploading Resume image...");
      uploadedResume = await uploadOnCloudinary(resumeImage);
      console.log("Resume image uploaded:", uploadedResume.url);
    }
    if (profileImage) {
      console.log("Uploading Profile image...");
      uploadedProfile = await uploadOnCloudinary(profileImage);
      console.log("Profile image uploaded:", uploadedProfile.url);
    }
    // if (otherImage) {
    //   console.log("Uploading Other image...");
    //   uploadedOther = await uploadOnCloudinary(otherImage);
    //   console.log("Other image uploaded:", uploadedOther.url);
    // }

    // Prepare update object
    const updateData = {
      ...(uploadedAadhaar && { aadhaarImage: uploadedAadhaar.url }),
      ...(uploadedPanCard && { panCardImage: uploadedPanCard.url }),
      ...(uploadedResume && { resumeImage: uploadedResume.url }),
      ...(uploadedProfile && { profileImage: uploadedProfile.url }),
      // ...(uploadedOther && { otherImage: uploadedOther.url }),
    };

    // Check if all required documents are uploaded
    if (uploadedAadhaar && uploadedPanCard && uploadedResume) {
      updateData.isKYCVerified = true; // Set KYC verified status
    }

    // Update AGENT
    const updatedAgent = await Backend.findOneAndUpdate(
      { _id: BACKENDID },
      { $set: updateData },
      { new: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({ message: "Backend not found" });
    }

    res.status(201).json({ message: "Backend KYC updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  backendLogin,
  verifyToken,
  backendSignup,
  backendDelete,
  backendDetail,
  backendKYC,
  backendKYCStatus,
};
