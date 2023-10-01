import { Types } from "mongoose";

export interface KeyTokenTypes {
  userId: Types.ObjectId;
  publicKey: string;
  privateKey: string;
  refreshToken: string;
}
