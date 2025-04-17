import express from "express";
import { register, login, logout,getProfile,googleLogin } from "../controller/authControllers.js";
import { authenticate } from "../middleware/auth.middleware.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Redirect to frontend with token (optional way)
    res.redirect(`http://localhost:5173?token=${token}`);
  }
);

router.post("/register", register);
router.post("/login", login);
router.post("/logout",authenticate, logout);
router.get("/profile", authenticate, getProfile);
// router.post("/google", googleLogin);    

export default router;
