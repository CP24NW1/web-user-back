import jwt from "jsonwebtoken";
import { getUserRoleQuery } from "../queries/authQueries.js";
import { pool } from "../db.js";

//-------------------
// AUTHENTICATION
//-------------------

export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Access token is required",
      });
    }
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(500).json({
      success: false,
      message: "An error occurred during token validation",
    });
  }
};

//-------------------
// AUTHORIZE
//-------------------

export const authorize = (role) => {
  return async (req, res, next) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized: No token provided" });
      }

      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      const user_id = decoded.user_id;

      const [results] = await pool.query(getUserRoleQuery, [user_id]);

      const [userRole] = results.map((result) => result.role);

      if (role.includes(userRole)) {
        return next();
      } else {
        return res
          .status(403)
          .json({ message: "Forbidden: Insufficient permissions" });
      }
    } catch (err) {
      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
      return res.status(500).json({ message: "Internal server error" });
    }
  };
};
