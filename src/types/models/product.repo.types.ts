import { Schema } from "mongoose";

export interface QueryAllDraftsTypes {
  product_shop: Schema.Types.ObjectId;
  limit?: number;
  skip?: number;
}

export interface PublishProductTypes {
  product_shop: Schema.Types.ObjectId;
  product_id: String;
}

export interface QueryAllPublishTypes extends QueryAllDraftsTypes {}

export interface FindAllProductTypes {
  limit?: number;
  sort?: string;
  page?: number;
  filter?: any;
  select?: any;
}

export interface FindProductType {
  product_id: string;
  unSelect?: any;
}
