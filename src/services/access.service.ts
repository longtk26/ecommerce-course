import shopModel from "../models/shop.model";
import bcrypt from "bcrypt";
import crypto from "crypto";

import KeyTokenService from "./keyToken.service";
import { createTokenPair } from "../auth/authUtils";
import { getInfoData } from "../utils";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static async signup({
    email,
    name,
    password,
  }: {
    email: string;
    name: string;
    password: string;
  }) {
    try {
      // step1: Check exist email
      const emailExist = await shopModel.findOne({ email }).lean();

      if (emailExist) {
        return {
          code: "xxxx",
          message: "Shop already registered!",
        };
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
        const publicKey = crypto.randomBytes(64).toString("hex");
        const privateKey = crypto.randomBytes(64).toString("hex");

        // save publicKey to DB
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxx",
            message: "keyStore error",
          };
        }

        // Created tokens pair
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKey,
          privateKey
        );

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  }
}

export default AccessService;
