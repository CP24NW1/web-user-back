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

    if (result.length < 1) {
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
// GET EXAM BY ID
//-------------------

export const getQuestionIDByExamLogID = async (req, res) => {
  const { exam_id } = req.body;

  const schema = Joi.object({
    exam_id: Joi.number().integer().positive().required(),
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

  try {
    const [result] = await pool.query(getQuestionIDByExamLogIDQuery, [exam_id]);

    if (result.length < 1) {
      return res.status(404).json({
        error: "exam_id not found on the database",
      });
    }
    const questionIDs = result.map((r) => r.question_id);

    res.json({
      question_id: questionIDs,
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
  const { exam_id, question_id } = req.body;

  try {
    const [result] = await pool.query(
      getQuestionDetailByExamLogIDAndQuestionIDQuery,
      [exam_id, question_id]
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

    console.log(formatResult);

    res.status(200).json({
      question: formatResult["1"],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
