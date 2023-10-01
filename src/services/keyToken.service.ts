import { Types } from "mongoose";

import keytokenModel from "../models/keytoken.model";
import { KeyTokenTypes } from "../types/services/keyToken.types";

class KeyTokenService {
  static async createKeyToken({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }: KeyTokenTypes) {
    try {
      // level 0
      // const tokens = await keytokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });

      // return tokens ? tokens.publicKey : null;

      // level xxx
      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokensUsed: [],
        refreshToken,
      };
      const option = { upsert: true, new: true };

      const tokens = await keytokenModel.findOneAndUpdate(
        filter,
        update,
        option
      );

      return tokens ? tokens.publicKey : null;
    } catch (error) {
      return error;
    }
  }

  static async findByUserId(userId: Types.ObjectId) {
    return await keytokenModel.findOne({ user: userId }).lean();
  }

  static async removeKeyById(id: Types.ObjectId) {
    return await keytokenModel.findByIdAndRemove(id).lean();
  }
}

export default KeyTokenService;
