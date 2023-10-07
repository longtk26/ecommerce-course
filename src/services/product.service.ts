import { Schema } from "mongoose";
import productModel from "../models/product.model";
import { ProductTypes } from "../types/services/product.types";
import { BadRequestError } from "../core/error.response";

const { product, electronic, clothing } = productModel;

// Define Factory class to create product
class ProductFactory {
  static async createProduct(type: string, payload: ProductTypes) {
    switch (type) {
      case "Electronic":
        return await new Electronic(payload).createProduct();
      case "Clothing":
        return await new Clothing(payload).createProduct();
      default:
        throw new BadRequestError(`Product type ${type} is not supported!`);
    }
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
  async createProduct() {
    return await product.create(this);
  }
}

// Define sub-class for different product types Clothing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create(this.product_attributes);
    if (!newClothing) throw new BadRequestError("Create new clothing error!");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error!");

    return newProduct;
  }
}

// Define sub-class for different product types Electronic

class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create(this.product_attributes);
    if (!newElectronic)
      throw new BadRequestError("Create new electronic error!");

    const newProduct = await super.createProduct();
    if (!newProduct) throw new BadRequestError("Create new product error!");

    return newProduct;
  }
}

export default ProductFactory;
