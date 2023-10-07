import { Router } from "express";
import { apiKey, permission } from "../auth/checkAuth";
import accessRoute from "./access";
import productRoute from "./product";

const indexRoute = Router();

// check API key
indexRoute.use(apiKey);

// check permission
indexRoute.use(permission("0000"));

indexRoute.use("/v1/api", accessRoute);
indexRoute.use("/v1/api/product", productRoute);

export default indexRoute;
