import express from "express";
import { getAllSkill } from "../controllers/test.js";

const router = express.Router();

// SKILL
router.get("", getAllSkill);

export default router;
