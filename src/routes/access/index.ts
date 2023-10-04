import { Router } from "express";
import accessController from "../../controllers/access.controller";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/authUtils";

const accessRoute = Router();

// Sign up
accessRoute.post("/shop/signup", asyncHandler(accessController.signUp));
accessRoute.post("/shop/login", asyncHandler(accessController.login));

// Authentication
accessRoute.use(authentication);
////////////////////////////
accessRoute.post("/shop/logout", asyncHandler(accessController.logout));
accessRoute.post(
  "/shop/handleRefreshToken",
  asyncHandler(accessController.handleRefreshToken)
);

export default accessRoute;
