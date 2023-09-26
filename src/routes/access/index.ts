import { Router } from "express";
import accessController from "../../controllers/access.controller";

const accessRoute = Router();

// Sign up
accessRoute.post("/shop/signup", accessController.signUp);

export default accessRoute;
