import { Types } from "mongoose";
import keytokenModel from "../models/keytoken.model";

class KeyTokenService {
  static async createKeyToken({
    userId,
    publicKey,
    privateKey,
  }: {
    userId: Types.ObjectId;
    publicKey: string;
    privateKey: string;
  }) {
    try {
      const tokens = await keytokenModel.create({
        user: userId,
        publicKey,
        privateKey,
      });

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }
}

export default KeyTokenService;
