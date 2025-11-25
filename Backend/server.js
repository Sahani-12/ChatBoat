import express from "express";
import dotenv from "dotenv";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";


dotenv.config();
const app = express();
const PORT = 8080;

// 1. Postman se JSON lene ke liye
app.use(express.json());
app.use(cors({
  origin: "*", 
  credentials: true
}));

app.use("/api", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on : ${PORT}`);
  connectDB();
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to database");
  } catch (error) {
    console.log("MongoDB connection error:",error);
  }
};
