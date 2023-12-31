import { Schema, Types } from "mongoose";

import productModel from "../models/product.model";
import { ProductTypes } from "../types/services/product.types";
import { BadRequestError } from "../core/error.response";
import {
  findAllDraftsForShop,
  findAllPublishForShop,
  publishProductByShop,
  searchProductByUser,
  unPublishProductByShop,
  findAllProducts,
  findProduct,
  updateProductById,
} from "../models/repositories/product.repo";
import {
  FindAllProductTypes,
  FindProductType,
  PublishProductTypes,
  QueryAllDraftsTypes,
  QueryAllPublishTypes,
} from "../types/models/product.repo.types";
import { removeUndefinedObject, updateNestedObjectParser } from "../utils";
import { insertInventory } from "../models/repositories/inventory.repo";

const { product, electronic, clothing, furniture } = productModel;

// Define Factory class to create product
class ProductFactory {
  static productRegistry: { [id: string]: any } = {}; //key-class

  static registerProductType(type: string, classRef: typeof Product) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type: string, payload: ProductTypes) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Product type ${type} is not supported!`);

    return await new productClass(payload).createProduct();
  }

  static async updateProduct(
    type: string,
    payload: ProductTypes,
    productId: string
  ) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Product type ${type} is not supported!`);

    return await new productClass(payload).updateProduct(productId);
  }

  // PUT //
  static async publishProductByShop({
    product_shop,
    product_id,
  }: PublishProductTypes) {
    return await publishProductByShop({ product_shop, product_id });
  }

  static async unPublishProductByShop({
    product_shop,
    product_id,
  }: PublishProductTypes) {
    return await unPublishProductByShop({ product_shop, product_id });
  }
  // END PUT //

  // Query
  static async findAllDraftsForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }: QueryAllDraftsTypes) {
    const query = { product_shop, isDraft: true };

    return await findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({
    product_shop,
    limit = 50,
    skip = 0,
  }: QueryAllPublishTypes) {
    const query = { product_shop, isPublished: true };

    return await findAllPublishForShop({ query, limit, skip });
  }

  static async searchProducts({ keySearch }: { keySearch: string }) {
    return await searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }: FindAllProductTypes) {
    return await findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }: FindProductType) {
    return await findProduct({ product_id, unSelect: ["__v"] });
  }
}

// Define base product class
class Product {
  product_name: String;
  product_thumb: String;
  product_description: String;
  product_price: Number;
  product_quantity: Number;
  product_type: String;
  product_shop: Schema.Types.ObjectId;
  product_attributes: Schema.Types.Mixed;

  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }: ProductTypes) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  //   create new product
  async createProduct(product_id: Types.ObjectId) {
    const newProduct = await product.create({ ...this, _id: product_id });

    // if (newProduct) {
    //   // add product_stock in inventory collection
    //   await insertInventory({
    //     productId: newProduct._id,
    //     shopId: this.product_shop,
    //     stock: this.product_quantity,
    //   });
    // }

    return newProduct;
  }

  //  update product
  async updateProduct(productId: string, bodyUpdate: any) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: product,
    });
  }
}

// Define sub-class for different product types Clothing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newClothing) throw new BadRequestError("Create new clothing error!");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct) throw new BadRequestError("Create new product error!");

    return newProduct;
  }

  async updateProduct(productId: string) {
    // 1. Rempve attributes have null and undefined values
    // 2. Check where need to be updated
    const objectParams = removeUndefinedObject(this);
    console.log(objectParams);
    if (objectParams.product_attributes) {
      // Update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        model: clothing,
      });
    }

    const updateProduct = await super.updateProduct(
      productId,
      updateNestedObjectParser(objectParams)
    );

    return updateProduct;
  }
}

// Define sub-class for different product types Electronic
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newElectronic)
      throw new BadRequestError("Create new electronic error!");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) throw new BadRequestError("Create new product error!");

    return newProduct;
  }
}

// Define sub-class for different product types Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });

    if (!newFurniture) throw new BadRequestError("Create new furniture error!");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) throw new BadRequestError("Create new product error!");

    return newProduct;
  }
}

// Register product type
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

export default ProductFactory;
