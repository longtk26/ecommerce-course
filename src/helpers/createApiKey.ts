import crypto from "crypto";
import apikeyModel from "../models/apikey.model";

export const createApiKey = async () => {
  const apiKey = crypto.randomBytes(64).toString("hex");
  await apikeyModel.create({ key: apiKey, permissions: ["0000"] });
};
