import { pool } from "../db.js";
import { examTestedSummarizeQueries } from "../queries/dashboardQueries.js";

export const getExamTestedSummarize = async (req, res) => {
  try {
    const [summarize] = await pool.query(examTestedSummarizeQueries, [5]);
    res.status(200).json({
      success: true,
      summarize: summarize,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
