import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import cartController from "../../controllers/cart.controller";
import { authentication } from "../../auth/authUtils";

const cartRouter = Router();

cartRouter.use(authentication);
cartRouter.post("/add", asyncHandler(cartController.addItemToCart));
cartRouter.get("/", asyncHandler(cartController.getItemsFromCart));
cartRouter.patch("/", asyncHandler(cartController.updateCart));
cartRouter.delete("/:id", asyncHandler(cartController.deleteItemFromCart));

export default cartRouter;
