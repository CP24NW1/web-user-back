import { pool } from "../db.js";
import { getAllSkillQuery } from "../queries/testQueries.js";

//-------------------
// GET ALL SKILL
//-------------------

export const getAllSkill = async (req, res) => {
  try {
    const [result] = await pool.query(getAllSkillQuery);
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
