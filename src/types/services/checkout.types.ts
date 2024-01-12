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
  user_address?: {
    street: string;
    city: string;
    state: string;
    country: string;
  };
  user_payment?: {
    cardNumber: string;
    cardName: string;
    cardExpire: string;
    cardCvv: string;
  };
};
