import Joi from "joi";
import { pool } from "../db.js";
import {
  createExamByRandomQuery,
  getAllExamLogIDQuery,
  getCorrectOptionIDByQuestionIDQuery,
  getMaxExamIDQuery,
  getOptionRangeQuery,
  getQuestionDetailByExamLogIDAndQuestionIDQuery,
  getQuestionIDByExamLogIDQuery,
  getQuestionsRandomQuery,
  getSelectedOptionIDByQuestionIDQuery,
  updateSelectOptionQuery,
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
    const [rows] = await pool.query(getMaxExamIDQuery);

    const exam_id = (rows[0]?.max_exam_id || 0) + 1;

    const [questions] = await pool.query(getQuestionsRandomQuery);

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

    await pool.query(createExamByRandomQuery, [examEntries]);

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
      return res.status(400).json({
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
    exam_id: Joi.number().integer().positive().required(),
    index: Joi.number().integer().required().min(0),
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

//-------------------
// USER SELECT OPTION
//-------------------

export const updateSelectOption = async (req, res) => {
  try {
    const [option] = await pool.query(getOptionRangeQuery, [
      req.body.question_id,
    ]);

    const range = option.map((o) => o.option_id);

    let min = range[0];
    let max = range[range.length - 1];

    const schema = Joi.object({
      exam_id: Joi.number().integer().positive().required(),
      question_id: Joi.number().integer().positive().required(),
      option_id: Joi.number()
        .integer()
        .positive()
        .min(min)
        .max(max)
        .required()
        .messages({
          "number.min": `option_id must be between ${min} - ${max}`,
          "number.max": `option_id must be between ${min} - ${max}`,
        }),
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
    const { exam_id, question_id, option_id } = value;

    const [result] = await pool.query(updateSelectOptionQuery, [
      option_id,
      exam_id,
      question_id,
    ]);

    res.status(200).json({
      success: true,
      message: "Option saved",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//-------------------
// CHECK ANSWER
//-------------------

//must answer all question
//update is_correct
//get summary

export const checkAnswer = async (req, res) => {
  const { exam_id } = req.body;

  //selected_option_id per question_id
  //correct_option_id per question_id

  try {
    const [questionID] = await pool.query(getQuestionIDByExamLogIDQuery, [
      exam_id,
    ]);

    if (!questionID.length) {
      return res
        .status(404)
        .json({ error: "No questions found for this exam." });
    }

    const questionCheckList = questionID.map((q) => q.question_id);

    // const [selectedOptionID] = await pool.query(
    //   getSelectedOptionIDByQuestionIDQuery,
    //   [1]
    // );

    // const [correctOptionID] = await pool.query(
    //   getCorrectOptionIDByQuestionIDQuery,
    //   [1]
    // );

    // console.log(questionID.map((q) => q.question_id));

    // //question_id for checking
    // //sample [5, 2, 1, 3, 4]
    // const questionCheckList = questionID.map((q) => q.question_id);

    // //option_id that user selected
    // const selectedOption = selectedOptionID[0]?.selected_option_id;

    // //option_id that correct
    // const correctOption = correctOptionID[0]?.option_id;

    const results = await Promise.all(
      questionCheckList.map(async (question_id) => {
        const [[selectedOption]] = await pool.query(
          getSelectedOptionIDByQuestionIDQuery,
          [question_id]
        );
        const [[correctOption]] = await pool.query(
          getCorrectOptionIDByQuestionIDQuery,
          [question_id]
        );

        return {
          question_id,
          selected_option_id: selectedOption?.selected_option_id || null,
          correct_option_id: correctOption?.option_id || null,
          isCorrect:
            selectedOption?.selected_option_id === correctOption?.option_id,
        };
      })
    );

    res.send(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
