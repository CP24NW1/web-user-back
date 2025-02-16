import express from "express";
import {
  checkAnswer,
  generateRandomExam,
  getAllExamLogID,
  getCountQuestionByExamID,
  getExamTestedDetail,
  getQuestionDetailByExamIDAndQuestionID,
  updateSelectOption,
} from "../controllers/examLog.js";

const router = express.Router();

// SKILL
router.post("/random", generateRandomExam);
router.get("/examID", getAllExamLogID);
router.post("/question", getQuestionDetailByExamIDAndQuestionID);
router.put("/select", updateSelectOption);
router.put("/submit", checkAnswer);
router.post("/question/count", getCountQuestionByExamID);
router.post("/history", getExamTestedDetail);

export default router;
