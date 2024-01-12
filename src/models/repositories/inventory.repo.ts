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

const reservationInventory = async ({
  productId,
  quantity,
  cartId,
}: {
  productId: string;
  quantity: number;
  cartId: string;
}) => {
  const query = {
    inven_productId: productId,
    inven_stock: { $gte: quantity },
  };
  const updateSet = {
    $inc: {
      inven_stock: -quantity,
    },
    $push: {
      inven_reservations: {
        quantity,
        cartId,
        createOn: new Date(),
      },
    },
  };
  const options = { upsert: true, new: true };

  return await inventory.updateOne(query, updateSet);
};

export { insertInventory, reservationInventory };
