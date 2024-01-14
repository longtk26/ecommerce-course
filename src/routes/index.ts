import { Router } from "express";
import { apiKey, permission } from "../auth/checkAuth";
import accessRoute from "./access";
import productRoute from "./product";
import cartRouter from "./cart";
import discountRoute from "./discount";
import orderRoute from "./order";
import invenRoute from "./inventory";
import { pushToLogDiscord } from "../middlewares";

const indexRoute = Router();

// Add log to discord
indexRoute.use(pushToLogDiscord);

// check API key
indexRoute.use(apiKey);

// check permission
indexRoute.use(permission("0000"));

indexRoute.use("/v1/api/product", productRoute);
indexRoute.use("/v1/api/discount", discountRoute);
indexRoute.use("/v1/api", accessRoute);
indexRoute.use("/v1/api/cart", cartRouter);
indexRoute.use("/v1/api/order", orderRoute);
indexRoute.use("/v1/api/inventory", invenRoute);

export default indexRoute;
