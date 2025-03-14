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
import { permissions } from "../utils/permission.js";

const router = express.Router();

// EXAM API
router.post("/random", auth, authorize(permissions.CREATE_EXAM_RANDOM), generateRandomExam);
router.get("/:user_id/all", auth, authorize(permissions.READ_EXAM) ,getAllExamLog);
router.put("/select/", auth, authorize(permissions.DO_EXAM) ,updateSelectOption);
router.put("/:exam_id/submit", auth, authorize(permissions.DO_EXAM), checkAnswer);
router.get("/:exam_id/count", auth, authorize(permissions.READ_EXAM), getCountQuestionByExamID);
router.get("/:exam_id/detail", auth, authorize(permissions.READ_EXAM), getExamTestedDetail);

export default router;
