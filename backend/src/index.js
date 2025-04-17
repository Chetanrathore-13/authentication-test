import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import "./config/passport.js"; // Import your passport configuration

dotenv.config();
const app = express();
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);

import verifyRoute from "./routes/verify.js";
app.use("/api/auth", verifyRoute);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT , () =>
      console.log("Server running")
    );
  })
  .catch((err) => console.log("MongoDB error: ", err));
