import express from "express";
import {
  checkAnswer,
  generateRandomExam,
  getAllExamLogID,
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

export default router;
