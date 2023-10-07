import { Schema } from "mongoose";

export interface ProductTypes {
  product_name: String;
  product_thumb: String;
  product_description: String;
  product_price: Number;
  product_quantity: Number;
  product_type: String;
  product_shop: Schema.Types.ObjectId;
  product_attributes: Schema.Types.Mixed;
}
