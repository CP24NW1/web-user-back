import express from "express";
import {
  checkAnswer,
  generateRandomExam,
  getAllExamLogID,
  getCountQuestionByExamID,
  getExamTestedDetail,
  updateSelectOption,
} from "../controllers/examLog.js";

import { auth } from "../middleware/auth.js";

const router = express.Router();

router.post("/random", auth, generateRandomExam);
router.get("/examID", auth, getAllExamLogID);
//แก้ สรุปใช้อยุ่ไหม
// router.post("/question", getQuestionDetailByExamIDAndQuestionID);
router.put("/select/", auth, updateSelectOption);
router.put("/:exam_id/submit", auth, checkAnswer);
router.get("/:exam_id/count", auth, getCountQuestionByExamID);
router.get("/:exam_id/detail", auth, getExamTestedDetail);

export default router;
