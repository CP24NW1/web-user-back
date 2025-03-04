import express from "express";
import {
  checkAnswer,
  generateRandomExam,
  getAllExamLog,
  getCountQuestionByExamID,
  getExamTestedDetail,
  updateSelectOption,
} from "../controllers/examLog.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

//
router.post("/random", auth, generateRandomExam);
//เปลี่ยน path api
router.get("/:user_id/all", auth, getAllExamLog);
//แก้ สรุปใช้อยุ่ไหม
// router.post("/question", getQuestionDetailByExamIDAndQuestionID);
router.put("/select/", auth, updateSelectOption);
router.put("/:exam_id/submit", auth, checkAnswer);
router.get("/:exam_id/count", auth, getCountQuestionByExamID);
router.get("/:exam_id/detail", auth, getExamTestedDetail);

export default router;
