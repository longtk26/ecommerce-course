export type ProductType = {
  productId: string;
  shopId?: string;
  quantity: number;
  name?: string;
  price: number;
};

export type DiscountAmountType = {
  code: string;
  userId: string;
  shopId: string;
  products: ProductType[];
};
