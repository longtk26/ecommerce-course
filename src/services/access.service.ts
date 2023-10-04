import shopModel from "../models/shop.model";
import bcrypt from "bcrypt";

import KeyTokenService from "./keyToken.service";
import { createTokenPair } from "../auth/authUtils";
import { createPublicAndPrivateKey, getInfoData } from "../utils";
import {
  AuthFailureError,
  BadRequestError,
  ForbiddenError,
} from "../core/error.response";
import {
  HandleRefreshTokenTypes,
  SignInTypes,
  SignUpTypes,
} from "../types/services/access.types";
import { findByEmail } from "./shop.service";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static async handleRefreshToken({
    refreshToken,
    user,
    keyStore,
  }: HandleRefreshTokenTypes) {
    const { userId, email } = user;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyTokenService.deleteByUserId(user.userId);
      throw new ForbiddenError("Something wrong happened! Please re-login");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop not registered!");

    // Create a new pair tokens
    const tokens = await createTokenPair(
      { userId, email },
      keyStore.publicKey,
      keyStore.privateKey
    );

    // update tokens
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  }

  static async logout(keyStore: any) {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);

    return delKey;
  }

  static async login({ email, password, refreshToken = null }: SignInTypes) {
    // Check shop exist
    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new BadRequestError("Shop not registered!");

    // Check match password
    const match = await bcrypt.compare(password, foundShop.password);
    if (!match) throw new AuthFailureError("Invalid credential!");

    // Create token pair
    const { publicKey, privateKey } = createPublicAndPrivateKey();

    const tokens = await createTokenPair(
      { userId: foundShop._id, email },
      publicKey,
      privateKey
    );

    // save publicKey and refreshToken to DB
    await KeyTokenService.createKeyToken({
      userId: foundShop._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      tokens,
    };
  }

  static async signup({ email, name, password }: SignUpTypes) {
    // step1: Check exist email
    const emailExist = await shopModel.findOne({ email }).lean();

    if (emailExist) {
      throw new BadRequestError("Shop already registered!");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // create private key and public key
      const { publicKey, privateKey } = createPublicAndPrivateKey();

      // Created tokens pair
      const tokens = await createTokenPair(
        { userId: newShop._id, email },
        publicKey,
        privateKey
      );

      // save publicKey and refreshToken to DB
      const keyStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
        refreshToken: tokens.refreshToken,
      });

      if (!keyStore) {
        throw new BadRequestError("Key store error!");
      }

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        tokens,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  }
}

export default AccessService;
