import dotenv from "dotenv";
import User from "../Models/UserData/User.model.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

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

const userExists = async (email) => {
  const user = await User.findOne({ email });
  return !!user;
};

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWTSECRET);
    req.user = decode;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

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
    const isMatch = await user.comparePassword(password);

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
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  userLogin,
  verifyToken,
  forgotPass,
  resetPassword,
};
