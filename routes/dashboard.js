import express from "express";

import { auth, authorize } from "../middleware/auth.js";
import { getExamTestedSummarize } from "../controllers/dashboard.js";

const router = express.Router();

// DASHBOARD API
router.get("/summary", getExamTestedSummarize)


export default router;
