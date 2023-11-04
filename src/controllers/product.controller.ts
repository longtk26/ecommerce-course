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

  // Update product

  async updateProduct(req: Request, res: Response) {
    const productId = req.params.productId;

    const data = await ProductService.updateProduct(
      req.body.product_type,
      {
        ...req.body,
        product_shop: req.user.userId,
      },
      productId
    );

    new SuccessReponse({
      message: "Updated product successfully!",
      metadata: data,
    }).send(res);
  }

  async publishProductByShop(req: Request, res: Response) {
    const data = await ProductService.publishProductByShop({
      product_shop: req.user.userId,
      product_id: req.params.id,
    });

    new SuccessReponse({
      message: "Publish product successfully!",
      metadata: data,
    }).send(res);
  }

  async unPublishProductByShop(req: Request, res: Response) {
    const data = await ProductService.unPublishProductByShop({
      product_shop: req.user.userId,
      product_id: req.params.id,
    });

    new SuccessReponse({
      message: "Unpublish product successfully!",
      metadata: data,
    }).send(res);
  }

  // Query
  /**
   * @description Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  async getAllDraftsForShop(req: Request, res: Response) {
    const data = await ProductService.findAllDraftsForShop({
      product_shop: req.user.userId,
    });

    new SuccessReponse({
      message: "Get list Drafts success!",
      metadata: data,
    }).send(res);
  }

  /**
   * @description Get all drafts for shop
   * @param {Number} limit
   * @param {Number} skip
   * @return {JSON}
   */
  async getAllPublishForShop(req: Request, res: Response) {
    const data = await ProductService.findAllPublishForShop({
      product_shop: req.user.userId,
    });

    new SuccessReponse({
      message: "Get list Published success!",
      metadata: data,
    }).send(res);
  }

  async getListSearchProduct(req: Request, res: Response) {
    const data = await ProductService.searchProducts({
      keySearch: req.params.keySearch,
    });

    new SuccessReponse({
      message: "Get list search success!",
      metadata: data,
    }).send(res);
  }

  async findAllProducts(req: Request, res: Response) {
    const data = await ProductService.findAllProducts(req.query);

    new SuccessReponse({
      message: "Get findAllProducts success!",
      metadata: data,
    }).send(res);
  }

  async findProduct(req: Request, res: Response) {
    const data = await ProductService.findProduct({
      product_id: req.params.product_id,
    });

    new SuccessReponse({
      message: "Get findProduct success!",
      metadata: data!,
    }).send(res);
  }
}

export default new ProductController();
