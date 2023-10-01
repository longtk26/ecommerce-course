import _ from "lodash";
import crypto from "crypto";

export const getInfoData = ({ fields, object }: any) => {
  return _.pick(object, fields);
};

export const createPublicAndPrivateKey = () => {
  const publicKey = crypto.randomBytes(64).toString("hex");
  const privateKey = crypto.randomBytes(64).toString("hex");

  return { publicKey, privateKey };
};
