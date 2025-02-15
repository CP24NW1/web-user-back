import Joi from "joi";
import { pool } from "../db.js";
import {
  createExamByRandomQuery,
  getAllExamLogIDQuery,
  getAllQuestionDetailByExamLogID,
  getCorrectOptionIDByQuestionIDQuery,
  getMaxExamIDQuery,
  getNotCompletedExamID,
  getOptionRangeQuery,
  getQuestionDetailByExamLogIDAndQuestionIDQuery,
  getQuestionIDByExamLogIDQuery,
  getQuestionsRandomQuery,
  getSelectedOptionIDByQuestionIDQuery,
  updateExamScore,
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

    const [notCompleteExamID] = await pool.query(getNotCompletedExamID);

    if (result.length === 0) {
      return res.status(400).json({
        error: "No exam on the database",
      });
    }
    // สร้าง Set ของ exam_id ที่ยังไม่เสร็จ
    const notCompletedSet = new Set(
      notCompleteExamID.map((exam) => exam.exam_id)
    );

    // เพิ่ม is_completed ในแต่ละ exam
    const examsWithStatus = result.map((exam) => ({
      ...exam,
      is_completed: !notCompletedSet.has(exam.exam_id),
    }));

    res.status(200).json({
      exams: examsWithStatus,
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

    const [notCompleteExamIDResult] = await pool.query(getNotCompletedExamID);

    const notCompleteExamID = notCompleteExamIDResult.map(
      (exam) => exam.exam_id
    );

    const isCompleted = !notCompleteExamID.includes(exam_id);

    res.status(200).json({
      success: true,
      message: "Option saved",
      is_completed: isCompleted,
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

  //prettier-ignore
  const { exam_id } = value;

  try {
    const [questionID] = await pool.query(getQuestionIDByExamLogIDQuery, [
      exam_id,
    ]);

    // console.log(exam_id);

    if (!questionID.length) {
      return res
        .status(404)
        .json({ error: "No questions found for this exam." });
    }

    const questionCheckList = questionID.map((q) => q.question_id);
    const results = [];

    for (const question_id of questionCheckList) {
      const [[selectedOption]] = await pool.query(
        getSelectedOptionIDByQuestionIDQuery,
        [exam_id, question_id]
      );
      const [[correctOption]] = await pool.query(
        getCorrectOptionIDByQuestionIDQuery,
        [question_id]
      );

      if (!selectedOption?.selected_option_id) {
        return res
          .status(400)
          .json({ error: `question_id: ${question_id} no selected option` });
      }

      const isCorrect =
        selectedOption.selected_option_id === correctOption?.option_id ? 1 : 0;

      await pool.query(updateExamScore, [isCorrect, exam_id, question_id]);

      results.push({
        question_id,
        selected_option_id: selectedOption.selected_option_id,
        correct_option_id: correctOption?.option_id || null,
        isCorrect,
      });
    }

    const correctCount = results.filter((r) => r.isCorrect).length;
    const totalQuestions = results.length;

    // console.log(results);

    res.status(200).json({
      success: true,
      total: totalQuestions,
      correct: correctCount,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//-------------------
// GET COUNT QUESTION BY EXAM ID
//-------------------

export const getCountQuestionByExamID = async (req, res) => {
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

  //prettier-ignore
  const { exam_id } = value;

  try {
    const [result] = await pool.query(getQuestionIDByExamLogIDQuery, [exam_id]);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ error: "No questions found for this exam." });
    }

    const count = result?.length;

    res.status(200).json({
      question_count: count,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//-------------------
// GET EXAM TESTED DETAIL
//-------------------

export const getExamTestedDetail = async (req, res) => {
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

  //prettier-ignore
  const { exam_id } = value;

  try {
    const [result] = await pool.query(getAllQuestionDetailByExamLogID, [
      exam_id,
    ]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Exam not found" });
    }

    const questionsMap = new Map();

    result.forEach((item) => {
      if (!questionsMap.has(item.question_id)) {
        questionsMap.set(item.question_id, {
          exam_id: item.exam_id,
          question_id: item.question_id,
          skill_name: item.skill_name,
          question_text: item.question_text,
          selected_option_id: item.selected_option_id,
          options: [],
        });
      }

      questionsMap.get(item.question_id).options.push({
        option_id: item.option_id,
        option_text: item.option_text,
        is_correct: item.is_correct,
      });
    });

    const formatData = Array.from(questionsMap.values());

    const isCompleted = !formatData.some(
      (data) => data.selected_option_id === null
    );

    res.status(200).json({
      is_completed: isCompleted,
      exam_detail: formatData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
