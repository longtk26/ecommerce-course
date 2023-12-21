import { Request, Response } from "express";
import CheckoutService from "../services/checkout.service";
import { SuccessReponse } from "../core/success.response";

class OrderController {
  async checkout(req: Request, res: Response) {
    const data = await CheckoutService.checkoutReview(req.body);

    new SuccessReponse({
      message: "Checkout successfully",
      metadata: data,
    }).send(res);
  }
}

export default new OrderController();
