import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const MONGO_URI = process.env.URI || '';

export const database = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("connected");
  } catch (error) {
    console.error(error);
  }
};