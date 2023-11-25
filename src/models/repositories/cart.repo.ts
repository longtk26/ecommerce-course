import { cart } from "../cart.model";

const createUserCart = async ({ userId, product }: any) => {
  const query = { cart_userId: userId, cart_status: "active" };
  const updateOrInsert = {
    $addToSet: {
      cart_products: product,
    },
  };
  const options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateOrInsert, options).lean();
};

const addNewItemToUserCart = async ({ userId, product }: any) => {
  const query = { cart_userId: userId, cart_status: "active" };
  const updateOrInsert = {
    $push: {
      cart_products: product,
    },
  };
  const options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateOrInsert, options).lean();
};

const updateUserCartQuantity = async ({ userId, product }: any) => {
  const { productId, quantity } = product;
  console.log("quantity updated", quantity);

  const query = {
    cart_userId: userId,
    "cart_products.productId": productId,
    cart_status: "active",
  };

  const updateSet = {
    $inc: {
      "cart_products.$.quantity": quantity,
    },
  };

  const options = { upsert: true, new: true };

  return await cart.findOneAndUpdate(query, updateSet, options);
};

export { createUserCart, updateUserCartQuantity, addNewItemToUserCart };
