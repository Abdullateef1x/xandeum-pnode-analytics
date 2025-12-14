import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const MONGO_URI = process.env.MONGO_URI;

export async function connectDB() {
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }
  try {
    await mongoose.connect(MONGO_URI);
    if (process.env.NODE_ENV !== "production") {
      console.log("[INFO] MongoDB connected");
    }

  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[ERROR] MongoDB connection failed:", err);
    }
    process.exit(1);
  }
}
