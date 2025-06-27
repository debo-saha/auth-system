
import express from "express";

import {
  signup,
  login,
  logout,
  forgotPassword,
  checkAuth,
  verifyEmail,
  resetPassword,
  resendOtp,
} from "../controllers/auth.controller.js";
import { authLimiter } from "../middleware/ratelimit.js";
import { verifyToken } from "../middleware/verfyToken.js";
const router = express.Router();


router.get("/check-auth", verifyToken, checkAuth);
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/verify-email", authLimiter, verifyEmail);
router.post("/logout",verifyToken, logout);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/resend-otp", authLimiter, resendOtp);
router.post("/reset-password/:token", authLimiter, resetPassword);

// ✅ Use ESM export
export default router;
