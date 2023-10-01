import { Request, Response } from "express";
import AccessService from "../services/access.service";
import { CREATED, SuccessReponse } from "../core/success.response";

class AccessController {
  async login(req: Request, res: Response) {
    const data = await AccessService.login(req.body);

    new SuccessReponse({
      message: "Login OK!",
      metadata: data,
    }).send(res);
  }

  async signUp(req: Request, res: Response) {
    const data = await AccessService.signup(req.body);

    new CREATED({
      message: "Registered OK!",
      metadata: data,
    }).send(res);
  }
}

export default new AccessController();
