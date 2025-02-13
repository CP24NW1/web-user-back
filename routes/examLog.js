import express from "express";
import { generateRandomExam } from "../controllers/examlog.js";

const router = express.Router();

// SKILL
router.post("", generateRandomExam);

export default router;
