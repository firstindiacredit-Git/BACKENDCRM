import dotenv from "dotenv";
import Agent from "../Models/EmployeeData/Employee.model.js";
import User from "../Models/UserData/User.model.js";
import userOTPVerification from "../Models/UserOTPVerificationForm/UserOTPVerification.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import otpGenerator from "otp-generator";
import { signupSchema } from "../Middlewares/ValidationSchema.js";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

dotenv.config({
  path: "./env",
});

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

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html: `
    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">FIC</a>
    </div>
    <p style="font-size:1.1em">Hi,</p>
    <p>Thank you for choosing FIC. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>
    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
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

const agentExists = async (referralId) => {
  const agent = await Agent.findOne({ referralId });
  console.log(!!agent);
  console.log(referralId);
  return !!agent;
};

const userExists = async (email, phone) => {
  const user = await User.findOne({ email, phone });
  console.log(!!user);
  console.log(email, phone);
  return !!user;
};

// Middleware for authentication
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWTSECRET);
    req.agent = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// export const agentLogin = async (req, res) => {
//   try {
//     const { referralId, password } = req.body;

//     // Check if agent exists
//     const agent = await Agent.findOne({ referralId });
//     if (!agent) {
//       return res.status(400).json({ message: "Agent does not exist." });
//     }

//     const isMatch = await agent.comparePassword(password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     agent.isLogin = true;
//     await agent.save();

//     // Generate JWT token
//     const token = jwt.sign(
//       { referralId, agentId: agent._id },
//       process.env.JWTSECRET
//     );

//     res.status(200).json({ token, referralId, agentId: agent._id });
//     console.log("Agent Logged in Successfully");
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };
export const agentLogin = async (req, res) => {
  try {
    const { referralId, password } = req.body;

    // Check if agent exists
    const agent = await Agent.findOne({ referralId });
    if (!agent) {
      return res.status(400).json({ message: "Agent does not exist." });
    }

    // Validate password
    const isMatch = await agent.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Set agent's login status
    agent.isLogin = true;
    await agent.save();

    // Generate JWT token with expiry
    const token = jwt.sign(
      { referralId, agentId: agent._id }, // Payload
      process.env.JWTSECRET // JWT secret key
      // { expiresIn: "6h" } // Token expiry time (1 hour)
    );

    // Respond with token and agent details
    res.status(200).json({ token, referralId, agentId: agent._id });
    console.log("Agent Logged in Successfully");
  } catch (error) {
    console.error("Error during agent login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const agentLogout = async (req, res) => {
  try {
    const { referralId } = req.body;

    if (!referralId) {
      return res.status(400).json({ message: "Referral ID is required" });
    }

    console.log("Logging out agent:", referralId);

    // Find the agent by referralId (not by ObjectId)
    const agent = await Agent.findOne({ referralId });

    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Update the agent's login status
    agent.isLogin = false; // Set to boolean false for logout
    await agent.save();

    // console.log("Agent updated:", agent);
    res.status(200).json({
      message: "Agent logged out successfully",
      isLogin: agent.isLogin,
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// cons

export const agentSignup = async (req, res) => {
  try {
    const { Name, password, referralId, Phone, position } = req.body;
    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    let uploadedAadhaar;
    let uploadedPanCard;

    if (aadhaarImage) {
      console.log("Uploading Aadhaar image...");
      const uploadedAadhaar = await uploadOnCloudinary(aadhaarImage);
      console.log("Aadhaar image uploaded:", uploadedAadhaar.url);
    }
    if (panCardImage) {
      console.log("Uploading Pan Card image...");
      const uploadedPanCard = await uploadOnCloudinary(panCardImage);
      console.log("Pan Card image uploaded:", uploadedPanCard.url);
    }

    // Check if user already exists
    if (await agentExists(referralId)) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    // Hash password for security
    const hashedPassword = await Agent.hashPassword(password);

    // Create new user
    const agent = new Agent({
      referralId,
      Name,
      password: hashedPassword,
      Phone,
      position,
      aadhaarImage: uploadedAadhaar?.url,
      panCardImage: uploadedPanCard?.url,
    });

    await agent.save();

    res.status(201).json({ message: "Agent created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const agentKYCStatus = async (req, res) => {
  try {
    const { id: AGENTID } = req.params; // Access AGENTID from params

    // console.log("Fetching KYC status for agent ID:", AGENTID); // Log the ID being searched

    const agent = await Agent.findOne({ _id: AGENTID }); // Use AGENTID directly
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }
    res.status(200).json({ isKYCVerified: agent.isKYCVerified });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const agentKYC = async (req, res) => {
  try {
    const { AGENTID } = req.body;
    const aadhaarImage = req.files?.aadhaarImage?.[0];
    const panCardImage = req.files?.panCardImage?.[0];
    const resumeImage = req.files?.resumeImage?.[0];
    const profileImage = req.files?.profileImage?.[0];
    const otherImage = req.files?.otherImage?.[0];

    // Initialize variables for uploaded images
    let uploadedAadhaar,
      uploadedPanCard,
      uploadedResume,
      uploadedProfile,
      uploadedOther;

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
    if (otherImage) {
      console.log("Uploading Other image...");
      uploadedOther = await uploadOnCloudinary(otherImage);
      console.log("Other image uploaded:", uploadedOther.url);
    }

    // Prepare update object
    const updateData = {
      ...(uploadedAadhaar && { aadhaarImage: uploadedAadhaar.url }),
      ...(uploadedPanCard && { panCardImage: uploadedPanCard.url }),
      ...(uploadedResume && { resumeImage: uploadedResume.url }),
      ...(uploadedProfile && { profileImage: uploadedProfile.url }),
      ...(uploadedOther && { otherImage: uploadedOther.url }),
    };

    // Check if all required documents are uploaded
    if (uploadedAadhaar && uploadedPanCard && uploadedResume) {
      updateData.isKYCVerified = true; // Set KYC verified status
    }

    // Update AGENT
    const updatedAgent = await Agent.findOneAndUpdate(
      { _id: AGENTID },
      { $set: updateData },
      { new: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.status(201).json({ message: "Agent KYC updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// export const updateAgentKYC = async (req, res) => {
//   try {
//     const { AGENTID } = req.body;
//     const aadhaarImage = req.files?.aadhaarImage?.[0];
//     const panCardImage = req.files?.panCardImage?.[0];
//     const resumeImage = req.files?.resumeImage?.[0];
//     const profileImage = req.files?.profileImage?.[0];

//     // Initialize variables for uploaded images
//     let uploadedAadhaar, uploadedPanCard, uploadedResume, uploadedProfile;

//     // Check for each file individually and upload
//     if (aadhaarImage) {
//       console.log("Uploading Aadhaar image...");
//       uploadedAadhaar = await uploadOnCloudinary(aadhaarImage);
//       console.log("Aadhaar image uploaded:", uploadedAadhaar.url);
//     }
//     if (panCardImage) {
//       console.log("Uploading Pan Card image...");
//       uploadedPanCard = await uploadOnCloudinary(panCardImage);
//       console.log("Pan Card image uploaded:", uploadedPanCard.url);
//     }
//     if (resumeImage) {
//       console.log("Uploading Resume image...");
//       uploadedResume = await uploadOnCloudinary(resumeImage);
//       console.log("Resume image uploaded:", uploadedResume.url);
//     }
//     if (profileImage) {
//       console.log("Uploading Profile image...");
//       uploadedProfile = await uploadOnCloudinary(profileImage);
//       console.log("Profile image uploaded:", uploadedProfile.url);
//     }

//     // Prepare update object
//     const updateData = {
//       ...(uploadedAadhaar && { aadhaarImage: uploadedAadhaar.url }),
//       ...(uploadedPanCard && { panCardImage: uploadedPanCard.url }),
//       ...(uploadedResume && { resumeImage: uploadedResume.url }),
//       ...(uploadedProfile && { profileImage: uploadedProfile.url }),
//     };

//     // Check if all required documents are uploaded
//     if (uploadedAadhaar && uploadedPanCard && uploadedResume) {
//       updateData.isKYCVerified = true; // Set KYC verified status
//     }

//     // Update AGENT
//     const updatedAgent = await Agent.findOneAndUpdate(
//       { _id: AGENTID },
//       { $set: updateData },
//       { new: true }
//     );

//     if (!updatedAgent) {
//       return res.status(404).json({ message: "Agent not found" });
//     }

//     res.status(201).json({ message: "Agent KYC updated successfully" });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const agentDelete = async (req, res) => {
  const agentId = req.query._id;
  try {
    const agentDelete = await Agent.findByIdAndDelete(agentId);

    if (!agentDelete) {
      return res.status(404).json({
        message: "Agent no found",
      });
    }
    return res.status(200).json({
      message: "Agent Deleted",
      agent: agentDelete,
    });
  } catch (error) {
    return res.status(500).json({
      error: "an error occure while deleting agent",
    });
  }
};

export const userSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, referralId } =
      req.body;

    const validation = signupSchema.safeParse({
      firstName,
      lastName,
      email,
      password,
      referralId,
      phone,
    });
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.errors[0].message,
      });
    }

    if (!(await agentExists(referralId))) {
      return res.status(400).json({ message: "Invalid referral ID" });
    }

    if (await userExists(email, phone)) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await User.hashPassword(password);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      referralId,
      verified: false,
    });

    const savedUser = await user.save();

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    const newOTPVerfication = new userOTPVerification({
      userId: savedUser._id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiredAt: Date.now() + 600000,
    });

    await newOTPVerfication.save();

    // Try sending OTP email with error handling
    try {
      await sendOTP(email, otp);
    } catch (error) {
      console.error("Email password", process.env.EMAIL_PASS);
      console.error("email user", process.env.EMAIL_USER);
      console.error("Error sending OTP email:", error);
      // Consider logging the error and sending a notification to the admin
      // You can return a specific error code for email sending issue here
    }

    res.status(201).json({
      message: "User created successfully, Check your email for verification",
      userId: savedUser._id,
      redirectUrl: "api/v1/user/verify-otp", // Replace with your actual URL
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    // Log the error with details for debugging
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { email, userId } = req.body;

    // Clear any existing OTPs for the user before generating a new one
    await userOTPVerification.deleteMany({ userId });

    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);

    const newOTPVerification = new userOTPVerification({
      userId,
      otp: hashedOTP,
      createdAt: Date.now(),
      expiredAt: Date.now() + 600000, // 10 minutes
    });

    await newOTPVerification.save();

    // Send OTP email outside of additional try-catch to ensure errors are caught properly
    await sendOTP(email, otp);

    res.status(201).json({
      message: "New OTP sent successfully. Check your email for verification.",
    });
  } catch (error) {
    console.error("Error during OTP resend:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    if (!userId || !otp) {
      return res
        .status(400)
        .json({ message: "Both OTP and user ID are required." });
    }

    const userOTPRecord = await userOTPVerification.findOne({ userId });
    if (!userOTPRecord) {
      return res.status(400).json({ message: "User does not exist." });
    }

    if (userOTPRecord.expiredAt < Date.now()) {
      await userOTPVerification.deleteMany({ userId });
      return res
        .status(400)
        .json({ message: "OTP has expired. Please request a new OTP." });
    }

    const validOTP = await bcrypt.compare(otp, userOTPRecord.otp);
    if (!validOTP) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    await User.updateOne({ _id: userId }, { verified: true });

    // Delete OTP after successful verification
    await userOTPVerification.deleteMany({ userId });

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const allAgents = async (req, res) => {
  try {
    const agents = await Agent.find({});
    const allAgents = agents.map((agent) => ({
      _id: agent._id,
      referralId: agent.referralId,
      Name: agent.Name,
      isLogin: agent.isLogin,
      position: agent.position,
      profileImage: agent.profileImage,
    }));
    // console.log("Sending allAgents:", allAgents);
    return res.status(200).json({ allAgents });
  } catch (error) {
    console.error("Error fetching agents", error.message);
    return res.status(500).json({
      message: "Error fetching AgentList",
      error: error.message,
    });
  }
};
export const allAgentsRef = async (req, res) => {
  try {
    const agents = await Agent.find({});
    // console.log("Fetched agents:", agents);
    const allAgentsRef = agents.map((agent) => ({
      referralId: agent.referralId,
      Name: agent.Name,
    }));
    console.log("Sending allAgents:", allAgentsRef);
    return res.status(200).json({ allAgentsRef });
  } catch (error) {
    console.error("Error fetching agents", error.message);
    return res.status(500).json({
      message: "Error fetching AgentList",
      error: error.message,
    });
  }
};

export const agentDetail = async (req, res) => {
  try {
    const { _id } = req.query;

    let agent = await Agent.findOne({ _id });

    if (!agent) {
      return res.status(404).json({
        message: "No Agent found",
      });
    }

    res.status(200).json({ agent });
  } catch (error) {
    console.error("Error getting agent details", error);
    return res.status(401).json({
      message: "Error fetching data of agent",
      error: error.message,
    });
  }
};

export default {
  agentLogin,
  agentLogout,
  agentSignup,
  agentDelete,
  userSignup,
  verifyToken,
  verifyOTP,
  allAgents,
  allAgentsRef,
  agentDetail,
};
