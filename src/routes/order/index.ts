import { Router } from "express";
import { authentication } from "../../auth/authUtils";
import { asyncHandler } from "../../helpers/asyncHandler";
import orderController from "../../controllers/order.controller";

const orderRoute = Router();

orderRoute.use(authentication);
orderRoute.post("/checkout", asyncHandler(orderController.checkout));

export default orderRoute;
