import express from "express";

import { auth } from "../middleware/auth.js";
import { getAllSkill, getExamTestedSummarize, getGeneralStats } from "../controllers/dashboard.js";

const router = express.Router();

// DASHBOARD API
router.get("/summary", auth, getExamTestedSummarize)
router.get("/stat", auth, getGeneralStats)
// router.get("/chart", auth, getBarChartData)

router.get("/skill", auth, getAllSkill)


export default router;
