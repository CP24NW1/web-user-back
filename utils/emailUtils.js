import nodemailer from "nodemailer";
import crypto from "crypto";

export const generateVerificationCode = () => {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
};

export const sendVerificationEmail = async (email, verificationCode) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: {
        name: "CP24NW1 NOTIFICATION",
        address: process.env.AUTH_EMAIL,
      },
      to: email,
      subject: "Email Verification",
      html: `<p>Your verification code is: <strong>${verificationCode}</strong></p>`,
    };

    // ส่งอีเมล
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info; // คืนค่าเมื่อส่งอีเมลสำเร็จ
  } catch (err) {
    console.log("Error sending email:", err);
    throw new Error("Failed to send verification email");
  }
};
