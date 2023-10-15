import { Request, Response } from "express";
import ProductService from "../services/product.service";
import { CREATED, SuccessReponse } from "../core/success.response";

class ProductController {
  async createProduct(req: Request, res: Response) {
    const data = await ProductService.createProduct(req.body.product_type, {
      ...req.body,
      product_shop: req.user.userId,
    });

    new CREATED({
      message: "Create new product successfully!",
      metadata: data,
    }).send(res);
  }
}

export default new ProductController();
