import { FlattenMaps } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      objKey: FlattenMaps;
      keyStore: FlattenMaps;
      user: JwtPayload;
      refreshToken: string;
    }
  }
}
