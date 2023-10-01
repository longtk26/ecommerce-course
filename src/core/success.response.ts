import { Response } from "express";

import { CREATEDResponseType, OKResponseType } from "../types/core";
import { httpStatusCode } from "../utils/httpStatusCode";

const { StatusCode, ReasonPhrases } = httpStatusCode;

class SuccessReponse {
  private message: string;
  private status: number;
  private metadata: any;

  constructor({
    message = "",
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res: Response, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessReponse {
  constructor({ message, metadata }: OKResponseType) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessReponse {
  private options: any;

  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
    options,
  }: CREATEDResponseType) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

export { OK, CREATED, SuccessReponse };
