import { Request, Response, NextFunction } from "express";
import AccessService from "../services/access.service";

class AccessController {
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AccessService.signup(req.body);

      return res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}

export default new AccessController();
