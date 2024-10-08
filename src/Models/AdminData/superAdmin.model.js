import mongoose from "mongoose";
// import bcrypt from "bcrypt";
const SuperAdminSchema = new mongoose.Schema({
  ID: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const SuperAdmin = mongoose.model("SuperAdmin", SuperAdminSchema);
export default SuperAdmin;
