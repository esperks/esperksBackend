import mongoose from "mongoose";

export const connectDB = () => {
  console.log("Connecting to MongoDB...");
  try {
    const uri = process.env.DB_URI || "mongodb://localhost:27017/esperk";
    mongoose
      .connect(uri)
      .then(() => {
        console.log("Connected to MongoDB ✅");
      })
      .catch((error) => {
        console.log("Error connecting to MongoDB");
        console.error(error);
      });
  } catch (error) {
    console.log("Error connecting to MongoDB");
    console.error(error);
  }
};
