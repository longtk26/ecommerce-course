import jwt from "jsonwebtoken";

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

    const decoded = jwt.verify(accessToken, publicKey);
    console.log("JWT decoded: ", decoded);

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error jwt: ", error);
    return error;
  }
};
