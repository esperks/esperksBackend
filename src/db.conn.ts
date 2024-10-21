import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.DB_URI || "mongodb://localhost:27017/esperk";
    await mongoose.connect(uri);
    console.log("Connected to MongoDB ✅");
  } catch (error) {
    console.log("Error connecting to MongoDB");
    console.error(error);
  }
};
