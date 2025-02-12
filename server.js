import express from "express";
import morgan from "morgan";
import cors from "cors";
import bodyParse from "body-parser";
import dotenv from "dotenv";
import { CustomError } from "./utils/CustomError.js";
import testRouter from "./routes/test.js";

dotenv.config();

const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParse.json({ limit: "10mb" }));

app.listen(5000, () => console.log("Web User Server is running on port 5000"));

app.use("/api/test", testRouter);

app.use("/api/check", (req, res) => {
  return res.status(200).json({ message: "ok!" });
});

app.all("*", (req, res, next) => {
  const err = new CustomError(
    `Can't find ${req.originalUrl} on the server!`,
    404
  );
  next(err);
});

app.use((error, req, res, next) => {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";
  res.status(error.statusCode).json({
    status: error.statusCode,
    message: error.message,
  });
});
