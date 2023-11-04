import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import { authentication } from "../../auth/authUtils";
import productController from "../../controllers/product.controller";

const productRoute = Router();

productRoute.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct)
);

productRoute.get("", asyncHandler(productController.findAllProducts));
productRoute.get("/:product_id", asyncHandler(productController.findProduct));

// Authentication
productRoute.use(authentication);
/////////////////////////

productRoute.patch(
  "/:productId",
  asyncHandler(productController.updateProduct)
);

productRoute.post("/new", asyncHandler(productController.createProduct));
productRoute.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop)
);
productRoute.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop)
);

// Query
productRoute.get(
  "/drafts/all",
  asyncHandler(productController.getAllDraftsForShop)
);
productRoute.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop)
);

export default productRoute;
