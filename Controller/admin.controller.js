import dotenv from "dotenv";
import Admin from "../Models/AdminData/Admin.models.js";
import jwt from "jsonwebtoken";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";
import { response } from "express";
dotenv.config({
  path: "./env",
});

// Middleware for authentication
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWTSECRET);
    req.admin = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

export const adminDelete = async (req, res) => {
  try {
    const { id } = req.params; // Match parameter name in route
    const deletedAdmin = await Admin.findByIdAndDelete(id); // Use findByIdAndDelete for simplicity

    if (deletedAdmin) {
      return res.status(200).json({ message: "Admin Deleted" });
    } else {
      return res.status(404).json({ error: "Admin not found" });
    }
  } catch (error) {
    console.error("Error deleting admin:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { ID, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ ID });
    if (!admin) {
      return res
        .status(400)
        .json({ message: "Admin does not exist. Please sign up." });
    }

    // Directly compare password (no hashing)
    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with expiry time
    const token = jwt.sign(
      { ID: admin.ID, role: "admin" }, // Payload
      process.env.JWTSECRET // JWT secret key
      // { expiresIn: "6h" } // Token expiry time
    );

    // Respond with token and admin ID
    res.status(200).json({ token, ID: admin.ID, role: "admin", id: admin._id });
    // //console.log("Admin logged in successfully");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminProfile = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id: userId } = req.params; // Get userId from URL parameters
    const profileImage = req.files?.profileImage?.[0];

    // Initialize variables for uploaded images
    let uploadedProfile;

    if (profileImage) {
      //console.log("Uploading Profile image...");
      uploadedProfile = await uploadOnCloudinary(profileImage);
      //console.log("Profile image uploaded:", uploadedProfile.url);
    }

    // Prepare update object
    const updateData = {
      ...(uploadedProfile && { profileImage: uploadedProfile.url }),
    };

    // Find the user
    const user = await Admin.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if old password matches and new password is provided
    if (oldPassword || newPassword) {
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          message:
            "Both old and new passwords are required to update the password.",
        });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect" });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(newPassword, salt);
    }

    // Update user details
    const updatedUser = await Admin.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password"); // Exclude password from the response

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
      updateImage: Admin.profileImage,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllDetailsAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findOne({ _id: id });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({ admin });
  } catch (error) {}
};
export default {
  adminLogin,
  verifyToken,
  adminProfile,
  getAllDetailsAdmin,
  adminProfile,
};
