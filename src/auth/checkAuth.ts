import { NextFunction, Request, Response } from "express";
import { findById } from "../services/apikey.service";

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "athorization",
};

export const apiKey = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const key = req.headers[HEADER.API_KEY]?.toString();
    if (!key) {
      return res.status(401).json({
        message: "Forbidden Error",
      });
    }

    // check objKey
    const objKey = await findById(key);
    if (!objKey) {
      return res.status(401).json({
        message: "Forbidden Error",
      });
    }

    req.objKey = objKey;

    return next();
  } catch (error) {
    return next(error);
  }
};

export const permission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    console.log("permission: ", req.objKey.permissions);

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      return res.status(403).json({
        message: "Permission denied",
      });
    }

    return next();
  };
};
