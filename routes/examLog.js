import express from "express";
import {
  checkAnswer,
  generateRandomExam,
  getAllExamLogID,
  getCountQuestionByExamID,
  getQuestionDetailByExamIDAndQuestionID,
  updateSelectOption,
} from "../controllers/examlog.js";

const router = express.Router();

// SKILL
router.post("/random", generateRandomExam);
router.get("/examID", getAllExamLogID);
router.post("/question", getQuestionDetailByExamIDAndQuestionID);
router.put("/select", updateSelectOption);
router.put("/submit", checkAnswer);
router.get("/question/count", getCountQuestionByExamID);

export default router;
