import { SortOrder } from "mongoose";
import {
  FindAllProductTypes,
  FindProductType,
  PublishProductTypes,
  UpdateProductByIdType,
} from "../../types/models/product.repo.types";
import { getSelectData, unGetSelectData } from "../../utils";
import productModel from "../product.model";

const { product, electronic, clothing, furniture } = productModel;

const findAllDraftsForShop = async ({
  query,
  limit,
  skip,
}: {
  query: any;
  limit: number;
  skip: number;
}) => {
  return await queryProduct({ query, limit, skip });
};

const findAllPublishForShop = async ({
  query,
  limit,
  skip,
}: {
  query: any;
  limit: number;
  skip: number;
}) => {
  return await queryProduct({ query, limit, skip });
};

const publishProductByShop = async ({
  product_shop,
  product_id,
}: PublishProductTypes) => {
  const foundShop = await product.findOne({ product_shop, _id: product_id });

  if (!foundShop) return null;

  foundShop.isDraft = false;
  foundShop.isPublished = true;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const unPublishProductByShop = async ({
  product_shop,
  product_id,
}: PublishProductTypes) => {
  const foundShop = await product.findOne({ product_shop, _id: product_id });

  if (!foundShop) return null;

  foundShop.isDraft = true;
  foundShop.isPublished = false;

  const { modifiedCount } = await foundShop.updateOne(foundShop);

  return modifiedCount;
};

const searchProductByUser = async ({ keySearch }: { keySearch: string }) => {
  const regexSearch = new RegExp(keySearch) as unknown as string;
  const results = await product
    .find(
      { isDraft: false, $text: { $search: regexSearch } },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

const findAllProducts = async ({
  limit,
  sort,
  page,
  filter,
  select,
}: FindAllProductTypes) => {
  const skip = page && limit ? (page - 1) * limit : 0;

  const sortBy: { [key: string]: SortOrder } =
    sort === "ctime" ? { _id: -1 } : { _id: 1 };

  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit!)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findProduct = async ({ product_id, unSelect }: FindProductType) => {
  return await product
    .findById(product_id)
    .select(unGetSelectData(unSelect))
    .lean();
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}: UpdateProductByIdType) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew });
};

const queryProduct = async ({
  query,
  limit,
  skip,
}: {
  query: any;
  limit: number;
  skip: number;
}) => {
  return await product
    .find(query)
    .populate("product_shop", "name email -_id")
    .sort({
      updatedAt: -1,
    })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const findProductById = async (productId: string) => {
  return await product.findOne({_id: productId}).lean()
}

export {
  findAllDraftsForShop,
  publishProductByShop,
  findAllPublishForShop,
  unPublishProductByShop,
  searchProductByUser,
  findAllProducts,
  findProduct,
  updateProductById,
  findProductById
};
