import mongoose from "mongoose";
import bcrypt from "bcrypt";
const backendSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  referralId: {
    type: String,
    required: true,
    unique: true,
  },
  Phone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  isLogin: {
    type: Boolean,
    default: false,
  },
  isKYCVerified: {
    type: Boolean,
    default: false,
  },
  aadhaarImage: { type: String },
  panCardImage: { type: String },
  resumeImage: { type: String },
  profileImage: { type: String },
});
backendSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Adding an instance method to compare password
backendSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const Backend = mongoose.model("Backend", backendSchema);
export default Backend;
