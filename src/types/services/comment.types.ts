import { ParsedTsconfig } from "typescript";

export type CreateCommentType = {
  productId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
};

export interface GetCommentByParentIdType {
  productId: string;
  parentCommentId?: string;
  limit?: number;
  offset?: number;
}

export type DeleteCommentsType = {
  productId: string;
  commentId: string;
};
