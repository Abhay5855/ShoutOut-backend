import express from "express";
import {
  registerUser,
  verifyEmail,
} from "../../controllers/user/user.controller.js";

const router = express.Router();

router.post("/signup", registerUser);

router.get("/verify/:token", verifyEmail);

export default router;
