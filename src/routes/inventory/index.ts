import { Router } from "express";
import { authentication } from "../../auth/authUtils";
import { asyncHandler } from "../../helpers/asyncHandler";
import inventoryController from "../../controllers/inventory.controller";

const invenRoute = Router();

invenRoute.use(authentication);
invenRoute.post("/new", asyncHandler(inventoryController.addStockToInventory));

export default invenRoute;
