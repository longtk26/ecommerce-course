import { InsertInventoryTypes } from "../../types/models/inventory.repo.types";
import inventory from "../inventory.model";

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unknown",
}: InsertInventoryTypes) => {
  return await inventory.create({
    inven_productId: productId,
    inven_stock: stock,
    inven_location: location,
    inven_shopId: shopId,
  });
};

export { insertInventory };
