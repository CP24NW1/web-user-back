export const getAllExamLogIDQuery = `SELECT DISTINCT exam_id, user_id, create_at, attempt_at, time_taken FROM examtesting`;

export const getQuestionIDByExamLogIDQuery = `SELECT DISTINCT e.question_id FROM examtesting e JOIN question q on e.question_id = q.question_id WHERE exam_id = ?`;

export const getQuestionDetailByExamLogIDAndQuestionIDQuery = `SELECT e.exam_id,  q.question_id, s.skill_name, q.question_text, o.option_text, o.is_correct
FROM examtesting e 
JOIN question q ON e.question_id = q.question_id
JOIN skill s ON s.skill_id = q.skill_id
JOIN choiceoption o ON o.question_id = q.question_id
WHERE exam_id = ? and e.question_id = ?;`;
