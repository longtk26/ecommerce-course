import jwt, { JwtPayload } from "jsonwebtoken";
import { Types } from "mongoose";

import { asyncHandler } from "../helpers/asyncHandler";
import { AuthFailureError, NotFoundError } from "../core/error.response";
import KeyTokenService from "../services/keyToken.service";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

export const createTokenPair = async (
  payload: any,
  publicKey: string,
  privateKey: string
) => {
  try {
    const accessToken = jwt.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = jwt.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error jwt: ", error);
    return error;
  }
};

export const authentication = asyncHandler(async (req, res, next) => {
  /**
   * 1. Check userId missing
   * 2. Get accessToken
   * 3. Verify token
   * 4. Check user in dbs
   * 5. Check keyStore with this userId
   * 6. OK all --> return next()
   */

  const userId = req.headers[HEADER.CLIENT_ID] as unknown as Types.ObjectId;
  if (!userId) throw new AuthFailureError("Invalid request!");

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found keystore!");

  const accessToken = req.headers[HEADER.AUTHORIZATION] as string;
  if (!accessToken) throw new AuthFailureError("Invalid request!");

  try {
    const decodeUser = jwt.verify(
      accessToken,
      keyStore.publicKey
    ) as JwtPayload;

    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid user!");

    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
