import { Router } from "express";
import accessRoute from "./access";
import { apiKey, permission } from "../auth/checkAuth";

const indexRoute = Router();

// check API key
indexRoute.use(apiKey);

// check permission
indexRoute.use(permission("0000"));

indexRoute.use("/v1/api", accessRoute);

export default indexRoute;
