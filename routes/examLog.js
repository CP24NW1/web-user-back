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

import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/random", auth, generateRandomExam);
router.get("/examID", auth, getAllExamLogID);
//แก้ สรุปใช้อยุ่ไหม
router.post("/question", getQuestionDetailByExamIDAndQuestionID);
//แก้ ใช้ :exam_id
router.put("/select", auth, updateSelectOption);
//แก้ ใช้ :exam_id
router.put("/submit", auth, checkAnswer);
//แก้ ใช้ :exam_id + METHOD GET
router.post("/question/count", auth, getCountQuestionByExamID);
//แก้ ชื่อ path
router.post("/history", getExamTestedDetail);

export default router;
