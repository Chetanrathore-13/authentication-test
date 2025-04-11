import express from "express";
import { register, login, logout,getProfile } from "../controller/authControllers.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout",authenticate, logout);
router.get("/profile", authenticate, getProfile);

export default router;
