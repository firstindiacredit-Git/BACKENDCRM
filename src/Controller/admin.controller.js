import dotenv from "dotenv";
import Admin from "../Models/AdminData/Admin.models.js";
import jwt from "jsonwebtoken";

dotenv.config({
  path: "./env",
});

const adminExists = async (ID) => {
  const admin = await Admin.findOne({ ID });
  return !!admin;
};

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
    if (!(await adminExists(ID))) {
      return res
        .status(400)
        .json({ message: "admin does not exist. Please sign up." });
    }

    // Validate password
    const admin = await Admin.findOne({ ID });

    // Generate JWT token
    const token = jwt.sign({ ID }, process.env.JWTSECRET);

    res.status(200).json({ token, ID });
    console.log("admin Logged in Successfully");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const adminSignup = async (req, res) => {
  try {
    const { ID, password } = req.body;

    // Check if user already exists
    if (await adminExists(ID)) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    // Hash password for security
    const hashedPassword = await Admin.hashPassword(password);

    // Create new user
    const admin = new Admin({
      ID,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export default {
  adminLogin,
  verifyToken,
  adminSignup,
};
