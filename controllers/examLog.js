import Joi from "joi";
import { pool } from "../db.js";
import {
  getAllExamLogIDQuery,
  getQuestionDetailByExamLogIDAndQuestionIDQuery,
  getQuestionIDByExamLogIDQuery,
} from "../queries/examLogQueries.js";

//-------------------
// CREATE EXAM RANDOMLY
//-------------------

export const generateRandomExam = async (req, res) => {
  const { user_id } = req.body;

  // const schema = Joi.object({
  //   user_id: Joi.number().integer().positive().required(),
  // });

  // // Validate
  // const { error, value } = schema.validate(req.body, { abortEarly: false });

  // if (error) {
  //   return res.status(400).json({
  //     success: false,
  //     error: "Validation Error",
  //     details: error.details.map((err) => err.message),
  //   });
  // }

  try {
    const [rows] = await pool.query(
      "SELECT MAX(exam_id) AS max_exam_id FROM examtesting"
    );

    const exam_id = (rows[0]?.max_exam_id || 0) + 1;

    const [questions] = await pool.query(
      "SELECT question_id FROM question WHERE is_available = TRUE ORDER BY RAND() LIMIT 20"
    );

    if (questions.length === 0) {
      throw new Error("No question available");
    }

    const examEntries = questions.map((q) => [
      exam_id,
      q.question_id,
      null,
      null,
      null,
      false,
    ]);

    await pool.query(
      "INSERT INTO examtesting (exam_id, question_id, user_id, attempt_at, time_taken, is_correct) VALUES ?",
      [examEntries]
    );

    res.status(201).json({
      success: true,
      message: "Exam created success randomly",
      exam_id: exam_id,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

//-------------------
// GET EXAM BY ID
//-------------------

export const getAllExamLogID = async (req, res) => {
  try {
    const [result] = await pool.query(getAllExamLogIDQuery);

    if (result.length === 0) {
      res.status(400).json({
        error: "No exam on the database",
      });
    }
    res.status(200).json({
      exams: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//-------------------
// GET QUESTION DETAIL
//-------------------

export const getQuestionDetailByExamIDAndQuestionID = async (req, res) => {
  const schema = Joi.object({
    exam_id: Joi.number().integer().positive().required().min(0),
    index: Joi.number().integer().positive().required().min(0),
  });

  // Validate
  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      details: error.details.map((err) => err.message),
    });
  }

  //prettier-ignore
  const { exam_id, index } = value;

  try {
    const [question_id] = await pool.query(getQuestionIDByExamLogIDQuery, [
      exam_id,
    ]);

    if (question_id.length === 0) {
      return res.status(404).json({
        error: "exam_id not found on the database",
      });
    }
    const questionID = question_id.map((r) => r.question_id)[index];

    const [result] = await pool.query(
      getQuestionDetailByExamLogIDAndQuestionIDQuery,
      [exam_id, questionID]
    );

    const formatResult = result.reduce(
      (acc, { option_id, option_text, is_correct, ...rest }) => {
        acc[rest.question_id] ??= { ...rest, options: [] };
        acc[rest.question_id].options.push({
          option_id,
          option_text,
          is_correct,
        });
        return acc;
      },
      {}
    );

    let entryResult;

    Object.values(formatResult).forEach((entry) => {
      entryResult = entry;
    });

    res.status(200).json({
      question: entryResult,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
