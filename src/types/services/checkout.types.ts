import { ProductType } from "./discount.types";

type ShopDiscountType = {
  shopId: string;
  code: string;
};

type ShopOrderType = {
  shopId: string;
  shop_discounts: ShopDiscountType[];
  products: ProductType[];
};

export type CheckoutInfoType = {
  cartId: string;
  userId: string;
  shop_order_ids: ShopOrderType[];
};
