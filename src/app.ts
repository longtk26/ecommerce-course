import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import "dotenv/config";

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
app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to ecommerce API!",
  });
});

// handle error

export default app;
