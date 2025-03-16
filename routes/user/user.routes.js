import express from "express";
import { registerUser } from "../../controllers/user/user.controller.js";

const router = express.Router();

router.post("/signup", registerUser);

router.get("/verifyemail:token");

export default router;
