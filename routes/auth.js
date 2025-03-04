import express from "express";
import {
  fetchMe,
  login,
  refreshAccessToken,
  register,
  verifyEmail,
} from "../controllers/auth.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

// AUTH
router.post("/register", register);
router.put("/verify", verifyEmail);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);
router.get("/me", auth, fetchMe);

export default router;
