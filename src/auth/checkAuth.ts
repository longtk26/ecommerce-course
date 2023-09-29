import { NextFunction, Request, Response } from "express";
import { findById } from "../services/apikey.service";
import { BadRequestError } from "../core/error.response";

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
      throw new BadRequestError("Missing API key!");
    }

    // check objKey
    const objKey = await findById(key);
    if (!objKey) {
      throw new BadRequestError();
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
      throw new BadRequestError("Permission denied");
    }

    console.log("permission: ", req.objKey.permissions);

    const validPermission = req.objKey.permissions.includes(permission);

    if (!validPermission) {
      throw new BadRequestError("Permission denied");
    }

    return next();
  };
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
