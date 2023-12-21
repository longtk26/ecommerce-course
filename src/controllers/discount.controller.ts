import { Request, Response } from "express";
import DiscountService from "../services/discount.service";
import { CREATED, SuccessReponse } from "../core/success.response";

class DiscountController {
  async createDiscountCode(req: Request, res: Response) {
    const data = await DiscountService.createDiscountCode({
      ...req.body,
      shopId: req.user.userId,
    });

    new CREATED({
      message: "Discount code created successfully",
      metadata: data,
    }).send(res);
  }

  async applyDiscountCode(req: Request, res: Response) {
    const data = await DiscountService.getDiscountAmount({
      ...req.body,
      userId: req.user.userId,
    });

    new SuccessReponse({
      message: "Discount code applied successfully",
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

  async cancelDiscountCode(req: Request, res: Response) {
    const data = await DiscountService.cancleDiscountCode({
      ...req.body,
      userId: req.user.userId,
    });

    new SuccessReponse({
      message: "Discount code cancelled successfully",
      metadata: data!,
    }).send(res);
  }

  async deleteDiscountCode(req: Request, res: Response) {
    const data = await DiscountService.deleteDiscountCode({
      codeId: req.params.codeId,
      shopId: req.user.userId,
    });

    new SuccessReponse({
      message: "Discount code cancelled successfully",
      metadata: data!,
    }).send(res);
  }
}

export default new DiscountController();
