import dotenv from "dotenv";
import User from "../Models/UserData/User.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

dotenv.config({
  path: "./env",
});

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send reset password email
const sendResetPasswordEmail = async (email, resetLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset Your Password",
    html: `
      <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
        <div style="margin:50px auto;width:70%;padding:20px 0">
          <div style="border-bottom:1px solid #eee">
            <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FIC</a>
          </div>
          <p style="font-size:1.1em">Hi,</p>
          <p>Click the link below to reset your password. The link is valid for 1 hour.</p>
          <a href="${resetLink}" style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;text-decoration: none;">Reset Password</a>
          <p style="font-size:0.9em;">Regards,<br />First India Credit</p>
          <hr style="border:none;border-top:1px solid #eee" />
          <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
            <p>FIC Inc</p>
            <p>NEW DELHI</p>
            <p>INDIA</p>
          </div>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Check if a user exists by email
const userExists = async (email) => {
  const user = await User.findOne({ email });
  return !!user;
};

// Get all users
export const allUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Verify JWT token middleware
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Assuming "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};
// Fetch user details by user ID
export const fetchUser = async (req, res) => {
  const { userId } = req.query; // Use query parameter instead of body for GET
  try {
    const user = await User.findById(userId); // Use findById for fetching by ID
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
export const AgentUsers = async (req, res) => {
  const { AGENT } = req.body;
  try {
    const users = await User.find({
      referralId: AGENT,
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching Agent users:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update user profile
export const userProfile = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const { id: userId } = req.params; // Get userId from URL parameters
    const profileImage = req.files?.profileImage?.[0];

    // Initialize variables for uploaded images
    let uploadedProfile;

    if (profileImage) {
      console.log("Uploading Profile image...");
      uploadedProfile = await uploadOnCloudinary(profileImage);
      console.log("Profile image uploaded:", uploadedProfile.url);
    }

    // Prepare update object
    const updateData = {
      ...(uploadedProfile && { profileImage: uploadedProfile.url }),
    };

    // Find the user
    const user = await User.findById(userId);
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
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select("-password"); // Exclude password from the response

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// User login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    if (!(await userExists(email))) {
      return res
        .status(400)
        .json({ message: "User does not exist. Please sign up." });
    }

    // Validate password
    const user = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    if (!user.verified) {
      return res.status(401).json({ message: "Please verify your account" });
    }

    // Generate JWT token
    const token = jwt.sign({ email, userId: user._id }, process.env.JWTSECRET);

    res
      .status(200)
      .json({ token, name: user.firstName, userId: user._id, email });
    console.log("User Logged in Successfully");
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot password
export const forgotPass = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    if (!(await userExists(email))) {
      return res.status(400).json({ message: "User does not exist." });
    }

    // Generate a reset token
    const resetToken = jwt.sign({ email }, process.env.JWTSECRET, {
      expiresIn: "1h",
    });

    // Create a reset link
    const resetLink = `https://crm.firstindiacredit.com/resetpassword?token=${resetToken}`;

    // Send reset password email
    await sendResetPasswordEmail(email, resetLink);

    res
      .status(200)
      .json({ message: "Password reset link sent to your email." });
  } catch (error) {
    console.error("Error in forgotPass:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Reset password
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.JWTSECRET);
    const email = decoded.email;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const AgentresetUserPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ensure email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "No user found with this email." });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save the updated user with new password
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// Exporting all controller functions
export default {
  userLogin,
  verifyToken,
  forgotPass,
  allUsers,
  resetPassword,
  AgentresetUserPassword,
  fetchUser,
  AgentUsers,
  userProfile,
};
