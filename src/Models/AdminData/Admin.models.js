import mongoose from "mongoose";
import bcrypt from "bcrypt";
const adminSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
adminSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Adding an instance method to compare password
adminSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};
const Admin = mongoose.model("Admin", adminSchema);
export default Admin;
