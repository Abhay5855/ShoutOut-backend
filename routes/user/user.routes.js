import express from "express";
import {
  registerUser,
  verifyEmail,
  authenticateUser,
  sendPasswordResetEmail,
  forgotPassword,
} from "../../controllers/user/user.controller.js";
import { verifyIsLoggedIn } from "../../middleware/index.js";

const router = express.Router();

router.post("/signup", registerUser);

router.get("/verify/:token", verifyEmail);

router.post("/login", authenticateUser);

router.get("/test", verifyIsLoggedIn);

router.post("/forgot-password", verifyIsLoggedIn, sendPasswordResetEmail);

router.post("/verify/forgot-password/:token", verifyIsLoggedIn, forgotPassword);

export default router;
