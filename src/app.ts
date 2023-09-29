import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import "dotenv/config";
import { Request, Response, NextFunction } from "express";

import indexRoute from "./routes";

const app = express();

// init middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
import "./dbs/init.mongodb";

// init routes
app.use("/", indexRoute);

// handle error

app.use((req, res, next) => {
  const error = new Error("Not Found") as any;

  error.status = 404;
  next(error);
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = error.status || 500;

  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal server error",
  });
});

export default app;
