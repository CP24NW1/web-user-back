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
//แก้ ใช้ :exam_id
router.put("/:exam_id/submit", auth, checkAnswer);
//แก้ ใช้ :exam_id + METHOD GET
router.get("/:exam_id/count", auth, getCountQuestionByExamID);
//แก้ ชื่อ path + METHOD GET + :exam_id
router.get("/:exam_id/detail", auth, getExamTestedDetail);

export default router;
