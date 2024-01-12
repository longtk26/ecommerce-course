import { BadRequestError } from "../core/error.response";
import inventoryModel from "../models/inventory.model";
import { findProductById } from "../models/repositories/product.repo";
import { StockType } from "../types/services/inventory.types";

class InventoryService {
  static async addStockToInventory({
    stock,
    productId,
    shopId,
    location = "HCM city",
  }: StockType) {
    const product = await findProductById(productId);

    if (!product) throw new BadRequestError("Product does not exist");

    const query = {
      inven_shopId: shopId,
      inven_productId: productId,
    };

    const updateSet = {
      $inc: {
        inven_stock: stock,
      },
      $set: {
        inven_location: location,
      },
    };

    const options = { upsert: true, new: true };

    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  }
}

export default InventoryService;
