import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dbConnection from "./database/dbConnection.js";
import { errorMiddleware } from "./error/error.js";
import reservationRouter from "./routes/reservationRoute.js";
import adminRouter from "./routes/adminRoute.js";
import feedbackRouter from "./routes/feedbackRoute.js";

const app = express();

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

// parsers first
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB connect
dbConnection();

// routes
app.use("/api/v1/reservation", reservationRouter);
app.use("/api/v1/admin",       adminRouter);
app.use("/api/v1/feedback",    feedbackRouter);

// error middleware LAST
app.use(errorMiddleware);

export default app;
