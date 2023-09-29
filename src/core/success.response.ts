import { Response } from "express";

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: "Success!",
  CREATED: "Created!",
};

class SuccessReponse {
  private message: string;
  private status: number;
  private metadata: any;

  constructor({
    message = "",
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
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
  constructor({ message, metadata }: { message: string; metadata: any }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessReponse {
  private options: any;

  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
    options,
  }: {
    message: string;
    metadata: any;
    statusCode?: number;
    reasonStatusCode?: string;
    options?: any;
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

export { OK, CREATED };
