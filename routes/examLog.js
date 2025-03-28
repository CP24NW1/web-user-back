import express from "express";
import {
  checkAnswer,
  explanationAI,
  generateCustomExam,
  generateRandomExam,
  getAllExamLog,
  getCountQuestionByExamID,
  getExamTestedDetail,
  suggestionAI,
  updateSelectOption,
} from "../controllers/examLog.js";

import { auth, authorize } from "../middleware/auth.js";

const router = express.Router();

// EXAM API
router.post("/random", auth, generateRandomExam);
router.post("/custom", auth, generateCustomExam);
router.get("/:user_id/all", auth, getAllExamLog);
router.put("/select/", auth, updateSelectOption);
router.put("/:exam_id/submit", auth, checkAnswer);
router.get("/:exam_id/count", auth, getCountQuestionByExamID);
router.get("/:exam_id/detail", auth, getExamTestedDetail);
router.post("/chat", explanationAI)
router.post("/chat/suggest", suggestionAI)

export default router;
