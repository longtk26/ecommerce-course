import { Response, Request } from "express";
import InventoryService from "../services/inventory.service";
import { CREATED } from "../core/success.response";

class InventoryController {
  async addStockToInventory(req: Request, res: Response) {
    const data = await InventoryService.addStockToInventory(req.body);

    new CREATED({
      message: "Stock added successfully",
      metadata: data,
    }).send(res);
  }
}

export default new InventoryController();
