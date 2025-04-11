import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () =>
      console.log("Server running")
    );
  })
  .catch((err) => console.log("MongoDB error: ", err));
