import mongoose from "mongoose";
const userOTPVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
});

userOTPVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const userOTPVerification = mongoose.model(
  "userOTPVerification",
  userOTPVerificationSchema
);
export default userOTPVerification;
