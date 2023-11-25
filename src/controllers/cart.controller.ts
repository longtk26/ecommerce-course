import { Request, Response } from "express";
import { SuccessReponse } from "../core/success.response";
import CartService from "../services/cart.service";

class CartController {
  async addItemToCart(req: Request, res: Response) {
    new SuccessReponse({
      message: "Added item to Cart",
      metadata: (await CartService.addToCart(req.body))!,
    }).send(res);
  }

  async getItemsFromCart(req: Request, res: Response) {
    new SuccessReponse({
      message: "Get items from Cart",
      metadata: (await CartService.getListItemsInCart({
        userId: req.user.userId,
      }))!,
    }).send(res);
  }

  async updateCart(req: Request, res: Response) {
    new SuccessReponse({
      message: "Updated Cart",
      metadata: (await CartService.updateCart(req.body))!,
    }).send(res);
  }

  async deleteItemFromCart(req: Request, res: Response) {
    new SuccessReponse({
      message: "Deleted item from Cart",
      metadata: (await CartService.deleteCartItem({
        userId: req.user.userId,
        productId: req.params.id,
      }))!,
    }).send(res);
  }
}

export default new CartController();
