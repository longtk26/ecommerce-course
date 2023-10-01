import { Router } from "express";
import accessController from "../../controllers/access.controller";
import { asyncHandler } from "../../auth/checkAuth";

const accessRoute = Router();

// Sign up
accessRoute.post("/shop/signup", asyncHandler(accessController.signUp));
accessRoute.post("/shop/login", asyncHandler(accessController.login));

export default accessRoute;
