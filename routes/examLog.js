import express from "express";
import {
  generateRandomExam,
  getAllExamLogID,
  getQuestionDetailByExamIDAndQuestionID,
  getQuestionIDByExamLogID,
} from "../controllers/examlog.js";

const router = express.Router();

// SKILL
router.post("/random", generateRandomExam);
router.get("/examID", getAllExamLogID);
router.post("/questionID", getQuestionIDByExamLogID);
router.post("/question", getQuestionDetailByExamIDAndQuestionID);

export default router;
