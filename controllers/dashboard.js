import { pool } from "../db.js";
import {
  ExamSummaryDTO,
  GeneralStatsDTO,
  SkillDTO,
} from "../dtos/dashboard.js";
import {
  barChartDataQuery,
  examTestedSummarizeAllQuery,
  examTestedSummarizeBySkillQuery,
  generalStatsQuery,
  getAllSkillQuery,
} from "../queries/dashboardQueries.js";

import jwt from "jsonwebtoken";

export const getExamTestedSummarize = async (req, res) => {
  //get user_id from token
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  const user_id = decoded.user_id;

  const skill = req.query.skill;

  try {
    let summary;
    if (!skill) {
      [summary] = await pool.query(examTestedSummarizeAllQuery, [user_id]);
    } else {
      [summary] = await pool.query(examTestedSummarizeBySkillQuery, [user_id]);
    }

    console.log(summary);
    const formattedSummary = summary.map((item) => new ExamSummaryDTO(item));

    res.status(200).json({
      success: true,
      summary: formattedSummary,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getGeneralStats = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  const user_id = decoded.user_id;
  try {
    const [stats] = await pool.query(generalStatsQuery, [user_id]);

    const formattedStats = new GeneralStatsDTO(stats[0]);

    res.status(200).json({
      success: true,
      stat: formattedStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// export const getBarChartData = async (req, res) => {
//   try {
//     const [data] = await pool.query(barChartDataQuery, [5]);
//     res.status(200).json({
//       success: true,
//       stat: data,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

export const getAllSkill = async (req, res) => {
  try {
    const [skill] = await pool.query(getAllSkillQuery);

    const formattedSkills = skill.map((item) => new SkillDTO(item));

    res.status(200).json({
      success: true,
      skill: formattedSkills,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
