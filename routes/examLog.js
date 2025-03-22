import express from "express";
import {
  checkAnswer,
  generateRandomExam,
  getAllExamLog,
  getCountQuestionByExamID,
  getExamTestedDetail,
  updateSelectOption,
} from "../controllers/examLog.js";

import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

// EXAM API
router.post("/random", auth, generateRandomExam);
router.get("/:user_id/all", getAllExamLog);
router.put("/select/", auth, updateSelectOption);
router.put("/:exam_id/submit", auth, checkAnswer);
router.get("/:exam_id/count", auth, getCountQuestionByExamID);
router.get("/:exam_id/detail", auth, getExamTestedDetail);

export default router;
