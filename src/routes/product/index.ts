import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/authUtils";
import productController from "../../controllers/product.controller";

const productRoute = Router();

// Authentication
productRoute.use(authentication);
/////////////////////////
productRoute.post("/new", asyncHandler(productController.createProduct));

export default productRoute;
