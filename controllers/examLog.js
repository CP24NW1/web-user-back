import { pool } from "../db.js";
//-------------------
// GET ALL SKILL
//-------------------

// ฟังก์ชันสุ่ม 20 question_id และ insert ลง examtesting
export const generateRandomExam = async (req, res) => {
  const { user_id } = req.body;
  try {
    // ดึงค่า exam_id ล่าสุดจากระบบ แล้วเพิ่มค่า +1
    const [rows] = await pool.query(
      "SELECT MAX(exam_id) AS max_exam_id FROM examtesting"
    );
    const exam_id = (rows[0]?.max_exam_id || 0) + 1; // ถ้ายังไม่มีข้อมูลในตาราง ให้เริ่มที่ 1

    // ดึง 20 question_id ที่ is_available = TRUE
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

    const [result] = await pool.query(
      `SELECT e.exam_question_id, e.exam_id, e.question_id, e.user_id, e.create_at, e.attempt_at, e.time_taken, e.is_correct as answer_correct, s.skill_id, s.skill_name, q.image_id, q.question_text, opt.option_id, opt.option_text, opt.is_correct
       FROM examtesting e 
       JOIN question q ON e.question_id = q.question_id 
       JOIN choiceoption opt ON opt.question_id = q.question_id 
       JOIN skill s ON s.skill_id = q.skill_id
       WHERE e.exam_id = ?`,
      [exam_id]
    );

    const responseResult = [
      ...result
        .reduce((map, item) => {
          const q = map.get(item.exam_question_id) || {
            exam_question_id: item.exam_question_id,
            exam_id: item.exam_id,
            user_id: item.user_id,
            create_at: item.create_at,
            attempt_at: item.attempt_at,
            time_taken: item.time_taken,
            question_id: item.question_id,
            skill_id: item.skill_id,
            skill_name: item.skill_name,
            image_id: item.image_id,
            answer_correct: item.answer_correct,
            question_text: item.question_text,
            options: [],
          };

          q.options.push({
            option_id: item.option_id,
            option_text: item.option_text,
            is_correct: item.is_correct,
          });

          return map.set(item.exam_question_id, q);
        }, new Map())
        .values(),
    ];

    res.status(201).json({
      success: true,
      message: "Exam created success randomly",
      exam_id: exam_id,
      timestamp: new Date().toISOString(),
      exam: responseResult,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};
