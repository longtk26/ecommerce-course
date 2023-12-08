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
    return await keytokenModel.findOne({ user: userId });
  }

  static async removeKeyById(id: Types.ObjectId) {
    return await keytokenModel.findByIdAndRemove(id).lean();
  }

  static async findByRefreshTokenUsed(refreshToken: string) {
    return await keytokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  }

  static async findByRefreshToken(refreshToken: string) {
    return await keytokenModel.findOne({ refreshToken });
  }

  static async deleteByUserId(userId: string) {
    return await keytokenModel.deleteOne({ user: userId });
  }
}

export default KeyTokenService;
