import mongoose from "mongoose";
import bcrypt from "bcrypt";

const agentSchema = new mongoose.Schema({
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
  aadhaarImage: { type: String },
  panCardImage: { type: String },
  profileImage: { type: String },
});

// Adding a static method to hash password
agentSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Adding an instance method to compare password
agentSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const Agent = mongoose.model("Agent", agentSchema);
export default Agent;
