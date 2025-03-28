export const examTestedSummarizeBySkillQuery = `
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
WHERE 
    e.user_id = ? 
    AND e.finish_at IS NOT NULL 
GROUP BY 
    e.exam_id, s.skill_name
ORDER BY 
    e.exam_id, MAX(e.finish_at);
`;

export const examTestedSummarizeAllQuery = `
SELECT 
    e.exam_id,
    CONCAT('Test ', e.exam_id) AS test,
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
WHERE 
    e.user_id = ? 
    AND e.finish_at IS NOT NULL 
GROUP BY 
    e.exam_id
ORDER BY 
    e.exam_id, MAX(e.finish_at);`;

export const generalStatsQuery = `
SELECT 
    COUNT(DISTINCT e.exam_id) AS total_exam_tested, 
    COUNT(e.question_id) AS total_questions, 
    CAST(SUM(e.is_correct) AS UNSIGNED) AS score,
    COUNT(*) AS total,
    ROUND((SUM(e.is_correct) * 100) / COUNT(*), 2) AS average_score 
FROM examtesting e
WHERE e.user_id = ?
AND e.finish_at IS NOT NULL;`;

export const barChartDataQuery = `
SELECT
    s.skill_name AS skills,
    ROUND(
        CASE 
            WHEN COUNT(e.is_correct) = 0 THEN 0
            ELSE (SUM(CASE WHEN e.is_correct = 1 THEN 1 ELSE 0 END) * 100) / COUNT(e.is_correct)
        END, 
        2
    ) AS correct_percentage,
    
    ROUND(
        CASE 
            WHEN COUNT(e.is_correct) = 0 THEN 0
            ELSE (COUNT(CASE WHEN e.is_correct = 0 THEN 1 END) * 100) / COUNT(e.is_correct)
        END, 
        2
    ) AS incorrect_percentage
FROM 
    skill s
LEFT JOIN 
    question q ON s.skill_id = q.skill_id
LEFT JOIN 
    examtesting e ON q.question_id = e.question_id
GROUP BY 
    s.skill_name;
`;

export const getAllSkillQuery = `SELECT * FROM skill;`;
