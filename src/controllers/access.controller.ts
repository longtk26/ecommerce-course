import { Request, Response } from "express";
import AccessService from "../services/access.service";
import { CREATED } from "../core/success.response";

class AccessController {
  async signUp(req: Request, res: Response) {
    const data = await AccessService.signup(req.body);

    new CREATED({
      message: "Registered OK!",
      metadata: data,
    }).send(res);
  }
}

export default new AccessController();
