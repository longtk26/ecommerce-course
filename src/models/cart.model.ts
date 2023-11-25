import { Schema, model } from "mongoose";

const DOCUMENT_NAME = "cart";
const COLLECTION_NAME = "carts";

const cartSchema = new Schema(
  {
    cart_userId: {
      type: String,
      required: true,
    },
    cart_status: {
      type: String,
      enums: ["pending", "active", "complete", "cancled"],
      default: "active",
    },
    cart_products: {
      type: Array,
      default: [],
    },
    cart_amount_products: {
      type: Number,
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "modifiedOn",
    },
  }
);

export const cart = model(DOCUMENT_NAME, cartSchema);
