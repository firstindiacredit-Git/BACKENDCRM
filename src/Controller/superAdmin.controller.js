import dotenv from "dotenv";
import Admin from "../Models/AdminData/Admin.models.js";
import jwt from "jsonwebtoken";
import SuperAdmin from "../Models/AdminData/superAdmin.model.js";

// Load environment variables
dotenv.config();

const adminExists = async (ID) => {
  const admin = await Admin.findOne({ ID });
  return !!admin;
};

export const adminSignup = async (req, res) => {
  try {
    const { ID, password, name, phone } = req.body;

    // Check if user already exists
    if (await adminExists(ID)) {
      return res.status(400).json({ message: "Admin already exists" });
    }
    const admin = new Admin({
      ID,
      password,
      phone,
      name,
    });

    await admin.save();

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const superAdminSignup = async (req, res) => {
  try {
    const { ID, password } = req.body;

    // Check if super admin already exists
    const existingSuperAdmin = await SuperAdmin.findOne({ ID });
    if (existingSuperAdmin) {
      return res.status(400).json({ message: "Super Admin already exists" });
    }

    // Create new super admin
    const superAdmin = new SuperAdmin({
      ID,
      password,
    });

    await superAdmin.save();

    res.status(201).json({ message: "Super Admin created successfully" });
  } catch (error) {
    console.log("Error during Super Admin signup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const superAdminLogin = async (req, res) => {
  try {
    const { ID, password } = req.body;

    // Check if super admin exists
    const superAdmin = await SuperAdmin.findOne({ ID });

    if (!superAdmin) {
      return res.status(400).json({ message: "Super Admin does not exist." });
    }

    // Check if password matches
    // const isMatch = await superAdmin.comparePassword(password);
    // if (!isMatch) {
    //   return res.status(400).json({ message: "Invalid credentials" });
    // }
    // Generate JWT token
    const token = jwt.sign(
      {
        ID: superAdmin.ID,
        role: "superAdmin", // Setting the role as superAdmin
      },
      process.env.JWTSECRET
      // { expiresIn: "1h" } // Token expiry time
    );

    // Return the token in response
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Middleware to verify superAdmin token
const verifySuperAdmin = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWTSECRET); // Extract Bearer token correctly

    if (decoded.role !== "superAdmin") {
      return res.status(403).json({ message: "Forbidden: Not a super admin" });
    }

    req.user = decoded; // Attach decoded token data to the request object
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(400).json({ message: "Invalid token" });
  }
};

// Get all admins - only accessible to superAdmin
export const allAdmins = [
  verifySuperAdmin,
  async (req, res) => {
    try {
      const admins = await Admin.find({});

      res.status(200).json({ message: "All Admins", admins });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
];

export default {
  adminSignup,
  superAdminLogin,
  superAdminSignup,
  allAdmins,
};
