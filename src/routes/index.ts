import { Router } from "express";
import accessRoute from "./access";

const indexRoute = Router();

// Main routes

indexRoute.use("/v1/api", accessRoute);

// Welcome to API
indexRoute.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to ecommerce API!",
  });
});

export default indexRoute;
