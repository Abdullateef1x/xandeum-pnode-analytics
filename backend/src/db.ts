import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const MONGO_URI = process.env.MONGO_URI;
console.log("MONGO_URI:", MONGO_URI);

export async function connectDB() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }
  try {
    await mongoose.connect(MONGO_URI);
  } catch (err) {
    console.error("[ERROR] MongoDB connection failed:", err);
  }
}
