import { Schema, Types } from "mongoose";

export interface InsertInventoryTypes {
  productId: Types.ObjectId;
  location?: string;
  stock: Number;
  shopId: Schema.Types.ObjectId;
}
