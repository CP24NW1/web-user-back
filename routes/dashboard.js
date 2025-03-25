import express from "express";

import { auth, authorize } from "../middleware/auth.js";
import { getBarChartDataQuery, getExamTestedSummarize, getGeneralStats } from "../controllers/dashboard.js";

const router = express.Router();

// DASHBOARD API
router.get("/summary", getExamTestedSummarize)
router.get("/stat", auth, getGeneralStats)
router.get("/chart", auth, getBarChartDataQuery)


export default router;
