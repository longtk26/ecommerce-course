import { AddCartType } from "../types/services/cart.types";
import { cart } from "../models/cart.model";
import {
  addNewItemToUserCart,
  createUserCart,
  updateUserCartQuantity,
} from "../models/repositories/cart.repo";
import { findProductById } from "../models/repositories/product.repo";
import { NotFoundError } from "../core/error.response";

class CartService {
  static async addToCart({ userId, product }: AddCartType) {
    const userCart = await cart.findOne({ cart_userId: userId });

    if (!userCart) {
      //Create new user cart and add product to it
      return await createUserCart({ userId: userId, product });
    }

    if (!userCart.cart_products.length) {
      //Add product to user cart
      userCart.cart_products = [product];
      return await userCart.save();
    }

    if (
      !userCart.cart_products.find(
        (item) => item.productId === product.productId
      )
    ) {
      console.log("here");
      return await addNewItemToUserCart({ userId: userId, product });
    }

    // Update product quantity
    return await updateUserCartQuantity({ userId: userId, product });
  }

  /*
      "shop_order_ids": [
        {
          "shopId": "123",
          "itemProducts": [
            {
              "productId": "123",
              "quantity": 1,
              "oldQuantity": 2,
              "shopId": "123",
              "price": 20000
            }
          ],
          version: 2
        }
      ]
  */
  static async updateCart({ userId, shop_order_ids }: any) {
    const { quantity, productId, oldQuantity } =
      shop_order_ids[0]?.itemProducts[0];

    const findProduct = await findProductById(productId);

    if (!findProduct) throw new NotFoundError("Product not found");

    if (findProduct.product_shop?.toString() !== shop_order_ids[0]?.shopId)
      throw new NotFoundError("Product not found in this shop");

    if (quantity === 0) {
      // delete product
    }

    return await updateUserCartQuantity({
      userId,
      product: {
        productId,
        quantity: quantity - oldQuantity,
      },
    });
  }

  static async deleteCartItem({ userId, productId }: any) {
    const query = { cart_userId: userId, cart_status: "active" };

    const updateSet = {
      $pull: {
        cart_products: { productId },
      },
    };

    return await cart.updateOne(query, updateSet);
  }

  static async getListItemsInCart({ userId }: any) {
    return await cart.findOne({ cart_userId: userId }).lean();
  }
}

export default CartService;
