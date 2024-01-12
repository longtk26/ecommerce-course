import { BadRequestError, NotFoundError } from "../core/error.response";
import orderModel from "../models/order.model";
import { findCartById } from "../models/repositories/cart.repo";
import { checkProductsByServer } from "../models/repositories/product.repo";
import { CheckoutInfoType } from "../types/services/checkout.types";
import DiscountService from "./discount.service";
import { acquireLock, releaseLock } from "./redis.service";

class CheckoutService {
  static async checkoutReview({
    cartId,
    userId,
    shop_order_ids,
  }: CheckoutInfoType) {
    // Check cart existed
    const foundCart = await findCartById(cartId);

    if (!foundCart) throw new NotFoundError("Cart not found");

    const checkoutOrder = {
      totalPrice: 0, // Total price order
      totalDiscount: 0, // Total discount
      totalCheckout: 0, // The price that user must pay
    };
    const shop_order_ids_new = [];

    for (let i in shop_order_ids) {
      const { shopId, shop_discounts, products } = shop_order_ids[i];

      const productsInDb = await checkProductsByServer(products);

      productsInDb.forEach((product) => {
        if (product.price < 0) throw new BadRequestError("Product is wrong");
      });

      const { discount = 0, totalOrder = 0 } =
        await DiscountService.getDiscountAmount({
          code: shop_discounts[0].code,
          shopId: shop_discounts[0].shopId,
          userId,
          products: productsInDb,
        });

      checkoutOrder.totalDiscount += discount;
      checkoutOrder.totalPrice += totalOrder;
      checkoutOrder.totalCheckout += totalOrder - discount;

      const itemCheckout = {
        shopId,
        shop_discounts,
        priceRaw: totalOrder,
        priceApplyDiscount: totalOrder - discount,
        products: productsInDb,
      };

      shop_order_ids_new.push(itemCheckout);
    }

    return {
      shop_order_ids,
      shop_order_ids_new,
      checkoutOrder,
    };
  }

  static async orderByUser({
    shop_order_ids,
    cartId,
    userId,
    user_address,
    user_payment,
  }: CheckoutInfoType) {
    // Checkout review again
    const { shop_order_ids_new, checkoutOrder } =
      await CheckoutService.checkoutReview({
        cartId,
        userId,
        shop_order_ids,
      });
    // Check inventory

    const products = shop_order_ids_new.flatMap((order) => order.products);

    console.log(`[1]:`, products);

    const acquireProduct = [];
    for (let i in products) {
      const { productId, quantity } = products[i];
      const keyLock = await acquireLock(productId, quantity, cartId);
      acquireProduct.push(keyLock ? true : false);

      if (keyLock) {
        await releaseLock(keyLock);
      }
    }

    // Check if have a product out of stock
    if (acquireProduct.includes(false)) {
      throw new BadRequestError(
        "Some products have updated, please check cart order!"
      );
    }

    const newOrder = await orderModel.create({
      order_userId: userId,
      order_checkout: checkoutOrder,
      order_shipping: user_address,
      order_payment: user_payment,
      order_products: shop_order_ids_new,
    });

    // if insert successfully, remove product from cart
    if (newOrder) {
      // remove products from cart
    }

    return newOrder;
  }

  static async getOrdersByUser() {}

  static async getOneOrderByUser() {}

  static async cancleOrderByUser() {}

  static async updateOrderStatusByShop() {}
}

export default CheckoutService;
