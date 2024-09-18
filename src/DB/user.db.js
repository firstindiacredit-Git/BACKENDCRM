// Importing necessary modules
import dotenv from "dotenv";
import mongoose from "mongoose";

// Configuring dotenv
dotenv.config();

// Defining the function for database connection
async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to database");
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
}

// Exporting the function
export default dbConnect;
