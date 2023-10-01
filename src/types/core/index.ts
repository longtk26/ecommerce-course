export interface SuccessResponseType {
  message: string;
  metadata: any;
  statusCode?: number;
  reasonStatusCode?: string;
}

export interface OKResponseType extends SuccessResponseType {}

export interface CREATEDResponseType extends SuccessResponseType {
  options?: any;
}
