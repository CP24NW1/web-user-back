import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  getExistUser,
  getUserDetail,
  grantRoleToUser,
  saveUser,
  verifyEmailSuccess,
} from "../queries/authQueries.js";
import {
  generateVerificationCode,
  sendVerificationEmail,
} from "../utils/emailUtils.js";

const accessSecret = process.env.JWT_ACCESS_SECRET;
const refreshSecret = process.env.JWT_REFRESH_SECRET;

//-------------------
// REGISTER
//-------------------

export const register = async (req, res) => {
  try {
    //validate data
    const { firstname, lastname, email, dob, password } = req.body;

    const [user] = await pool.query(getExistUser, [email]);
    if (user.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User's email already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const encryptPassword = await bcrypt.hash(password, salt);

    const verificationCode = generateVerificationCode();

    await sendVerificationEmail(email, verificationCode);

    const [result] = await pool.query(saveUser, [
      firstname,
      lastname,
      email,
      dob,
      encryptPassword,
      false,
      verificationCode,
    ]);

    //add base permission => READ_PROFILE_WEB_USER (permission_id: 2)
    await pool.query(grantRoleToUser, [3, result.insertId]);

    res.status(201).json({
      success: true,
      message:
        "Registration successful. Please check your email to verify your account.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during registration. Please try again later.",
    });
  }
};

//-------------------
// EMAIL VERIFICATION
//-------------------

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: "Email and verification code are required.",
      });
    }

    const [user] = await pool.query(getExistUser, [email]);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user[0].verification_code !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code.",
      });
    }

    await pool.query(verifyEmailSuccess, [true, email]);

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred during email verification. Please try again later.",
    });
  }
};

//-------------------
// LOGIN
//-------------------

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [user] = await pool.query(getExistUser, [email]);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ตรวจสอบว่าผู้ใช้ยืนยันอีเมลหรือยัง
    if (!user[0].is_verify) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    const user_id = user[0]?.user_id;

    const payload = { email, user_id };

    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: "1h" });

    const refreshToken = jwt.sign(payload, refreshSecret, {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      accessToken: `Bearer ${accessToken}`,
      refreshToken: `Bearer ${refreshToken}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred during login. Please try again later.",
    });
  }
};

//-------------------
// REFRESH ACCESS TOKEN
//-------------------

export const refreshAccessToken = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    const refreshToken = authHeader.split(" ")[1];

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "No refresh token provided",
      });
    }

    jwt.verify(refreshToken, refreshSecret, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Invalid or expired refresh token",
        });
      }

      const payload = { username: decoded.username };
      const accessToken = jwt.sign(payload, accessSecret, {
        expiresIn: "1h",
      });

      res.status(200).json({
        success: true,
        message: "Access token refreshed successfully",
        accessToken: `Bearer ${accessToken}`,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while refreshing access token",
    });
  }
};

//-------------------
// FETCH USER INFO
//-------------------
export const fetchMe = async (req, res) => {
  const user_id = req.params?.user_id;
  try {
    const [user] = await pool.query(getUserDetail, [user_id]);

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
