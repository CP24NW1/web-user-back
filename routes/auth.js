import express from "express";
import { login, refreshAccessToken, register } from "../controllers/auth.js";

const router = express.Router();

// AUTH
router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshAccessToken);

export default router;
