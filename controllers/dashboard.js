import { pool } from "../db.js";
import {
  barChartDataQuery,
  examTestedSummarizeAllQuery,
  examTestedSummarizeBySkillQuery,
  generalStatsQuery,
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
    res.status(200).json({
      success: true,
      summary: summary,
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
    res.status(200).json({
      success: true,
      stat: stats[0],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getBarChartDataQuery = async (req, res) => {
  try {
    const [data] = await pool.query(barChartDataQuery, [5]);
    res.status(200).json({
      success: true,
      stat: stats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};
