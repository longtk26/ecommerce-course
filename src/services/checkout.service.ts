import { BadRequestError, NotFoundError } from "../core/error.response";
import { findCartById } from "../models/repositories/cart.repo";
import { checkProductsByServer } from "../models/repositories/product.repo";
import { CheckoutInfoType } from "../types/services/checkout.types";
import DiscountService from "./discount.service";

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
}

export default CheckoutService;
