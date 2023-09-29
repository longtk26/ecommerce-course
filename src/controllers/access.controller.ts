import { Request, Response } from "express";
import AccessService from "../services/access.service";

class AccessController {
  async signUp(req: Request, res: Response) {
    const data = await AccessService.signup(req.body);

    return res.status(200).json(data);
  }
}

export default new AccessController();
