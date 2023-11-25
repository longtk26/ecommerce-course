import { String } from "lodash";

export interface AddCartType {
  userId: String;
  product: {
    productId: String;
  };
}
