import dotenv from "dotenv";
import Admin from "../Models/AdminData/Admin.models.js";
import jwt from "jsonwebtoken";

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

    // Validate password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with expiry time
    const token = jwt.sign(
      { ID: admin.ID, role: "admin" }, // Payload
      process.env.JWT_SECRET // JWT secret key
      // { expiresIn: "6h" } // Token expiry time
    );

    // Respond with token and admin ID
    res.status(200).json({ token, ID: admin.ID, role: "admin" });
    console.log("Admin logged in successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  adminLogin,
  verifyToken,
};
