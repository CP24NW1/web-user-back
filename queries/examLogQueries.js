export const getMaxExamIDQuery = `SELECT MAX(exam_id) AS max_exam_id FROM examtesting`;

export const getQuestionsRandomQuery = `SELECT question_id FROM question WHERE is_available = TRUE ORDER BY RAND() LIMIT 20`;

export const createExamByRandomQuery = `INSERT INTO examtesting (exam_id, question_id, user_id, attempt_at, time_taken, is_correct) VALUES ?`;

export const getAllExamLogIDQuery = `SELECT DISTINCT exam_id, user_id, create_at, attempt_at, finish_at, time_taken FROM examtesting`;

export const getQuestionIDByExamLogIDQuery = `SELECT DISTINCT e.question_id FROM examtesting e JOIN question q on e.question_id = q.question_id WHERE exam_id = ?`;

export const getQuestionDetailByExamLogIDAndQuestionIDQuery = `SELECT e.exam_id,  q.question_id, s.skill_name, q.question_text, o.option_id, o.option_text, o.is_correct, e.selected_option_id
FROM examtesting e 
JOIN question q ON e.question_id = q.question_id
JOIN skill s ON s.skill_id = q.skill_id
JOIN choiceoption o ON o.question_id = q.question_id
WHERE exam_id = ? and e.question_id = ?;`;

export const updateSelectOptionQuery = `UPDATE examtesting e SET e.selected_option_id = ? WHERE e.exam_id = ? AND e.question_id = ?`;

export const getOptionRangeQuery = `SELECT o.option_id FROM choiceoption o WHERE o.question_id = ?`;

export const getSelectedOptionIDByQuestionIDQuery = `SELECT e.selected_option_id FROM examtesting e WHERE e.exam_id = ? AND e.question_id = ?`;

export const getCorrectOptionIDByQuestionIDQuery = `SELECT o.option_id FROM choiceoption o WHERE o.question_id = ? AND o.is_correct = 1`;

export const updateExamScore = `UPDATE examtesting e SET e.is_correct = ?, e.finish_at = now() WHERE e.exam_id = ? AND e.question_id = ?`;

export const getAllQuestionDetailByExamLogID = `SELECT e.exam_id, e.finish_at, q.question_id, s.skill_name, q.question_text, o.option_id, o.option_text, o.is_correct, e.selected_option_id
FROM examtesting e 
JOIN question q ON e.question_id = q.question_id
JOIN skill s ON s.skill_id = q.skill_id
JOIN choiceoption o ON o.question_id = q.question_id
WHERE exam_id = ? ORDER BY e.exam_question_id;`;

export const getNotCompletedExamID = `SELECT DISTINCT e.exam_id FROM examtesting e WHERE e.finish_at IS null;`;

export const getInprogressExamID = `SELECT DISTINCT e.exam_id FROM examtesting e WHERE e.selected_option_id IS null;`;
