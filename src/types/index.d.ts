import { FlattenMaps } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      objKey: FlattenMaps;
      keyStore: FlattenMaps;
    }
  }
}
