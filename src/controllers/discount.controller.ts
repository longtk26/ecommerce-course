import { Request, Response } from "express";
import DiscountService from "../services/discount.service";
import { CREATED, SuccessReponse } from "../core/success.response";

class DiscountController {
  async createDiscountCode(req: Request, res: Response) {
    const data = await DiscountService.createDiscountCode(req.body);

    new CREATED({
      message: "Discount code created successfully",
      metadata: data,
    }).send(res);
  }

  async getProductsByDiscountCode(req: Request, res: Response) {
    const data = await DiscountService.getProductsByDiscountCode(req.query);

    new SuccessReponse({
      message: "Products retrieved successfully",
      metadata: data,
    }).send(res);
  }

  async getAllDiscountCodesByShop(req: Request, res: Response) {
    const data = await DiscountService.getAllDiscountCodesByShop(req.query);

    new SuccessReponse({
      message: "Discount codes retrieved successfully",
      metadata: data,
    }).send(res);
  }
}

export default new DiscountController();
