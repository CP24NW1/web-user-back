export const examTestedSummarizeQueries = `
SELECT 
    e.exam_id,
    CONCAT('Test ', e.exam_id) AS test,
    s.skill_name AS skills,
    SUM(e.is_correct) AS score,
    COUNT(*) AS total,
	CONCAT(ROUND((SUM(e.is_correct) * 100) / COUNT(*), 2), '%') AS percentage,
    MAX(e.finish_at) AS submitted_date
FROM 
    examtesting e
JOIN 
    question q ON e.question_id = q.question_id 
JOIN 
    skill s ON q.skill_id = s.skill_id 
WHERE e.user_id = ?
GROUP BY 
    e.exam_id, s.skill_name
ORDER BY 
    e.exam_id, MAX(e.finish_at);
`;
