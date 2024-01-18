import { Request, Response } from "express";
import CommentService from "../services/comment.service";
import { CREATED, SuccessReponse } from "../core/success.response";
import { GetCommentByParentIdType } from "../types/services/comment.types";

class CommentController {
  async createComment(req: Request, res: Response) {
    const comment = await CommentService.createComment(req.body);

    return new CREATED({
      message: "Comment created successfully",
      metadata: comment,
    }).send(res);
  }

  async getCommentByParentId(req: Request, res: Response) {
    const query: GetCommentByParentIdType = {
      productId: req.query.productId as string,
      ...req.query,
    };

    const comments = await CommentService.getCommentByParentId(query);

    return new SuccessReponse({
      message: "Get comment successfully",
      metadata: comments,
    }).send(res);
  }

  async deleteComments(req: Request, res: Response) {
    await CommentService.deleteComments(req.body);

    return new SuccessReponse({
      message: "Delete comment successfully",
    }).send(res);
  }
}

export default new CommentController();
