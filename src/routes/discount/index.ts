import { Router } from "express";
import { authentication } from "../../auth/authUtils";
import { asyncHandler } from "../../helpers/asyncHandler";
import discountController from "../../controllers/discount.controller";

const discountRoute = Router();

discountRoute.get(
  "/products",
  asyncHandler(discountController.getProductsByDiscountCode)
);

discountRoute.use(authentication);

discountRoute.get(
  "/",
  asyncHandler(discountController.getAllDiscountCodesByShop)
);

discountRoute.post("/new", asyncHandler(discountController.createDiscountCode));

export default discountRoute;
