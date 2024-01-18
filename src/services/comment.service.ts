import { NotFoundError } from "../core/error.response";
import commentModel from "../models/comment.model";
import { findProduct } from "../models/repositories/product.repo";
import {
  CreateCommentType,
  DeleteCommentsType,
  GetCommentByParentIdType,
} from "../types/services/comment.types";

class CommentService {
  static async createComment({
    productId,
    userId,
    content,
    parentCommentId,
  }: CreateCommentType) {
    const comment = await commentModel.create({
      comment_productId: productId,
      comment_userId: userId,
      comment_content: content,
      comment_parentId: parentCommentId,
    });

    let rightValue;
    if (parentCommentId) {
      //Reply comment
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) throw new NotFoundError("Comment parent not found");
      rightValue = parentComment.comment_right;

      // updateMany comments
      await commentModel.updateMany(
        {
          comment_productId: productId,
          comment_right: { $gte: rightValue },
        },
        {
          $inc: { comment_right: 2 },
        }
      );

      await commentModel.updateMany(
        {
          comment_productId: productId,
          comment_left: { $gt: rightValue },
        },
        {
          $inc: { comment_left: 2 },
        }
      );
    } else {
      const maxRightValue = await commentModel.findOne(
        {
          comment_productId: productId,
        },
        "comment_right",
        { sort: { comment_right: -1 } }
      );

      if (maxRightValue) {
        rightValue = maxRightValue.comment_right + 1;
      } else {
        rightValue = 1;
      }
    }

    // Insert comment
    comment.comment_left = rightValue!;
    comment.comment_right = rightValue! + 1;

    await comment.save();

    return comment;
  }

  static async getCommentByParentId({
    productId,
    parentCommentId,
    limit = 50,
    offset = 0,
  }: GetCommentByParentIdType) {
    if (parentCommentId) {
      const parent = await commentModel.findById(parentCommentId);

      if (!parent) throw new NotFoundError("Comment not found for product");

      const comments = await commentModel
        .find({
          comment_productId: productId,
          comment_left: { $gt: parent.comment_left },
          comment_right: { $lte: parent.comment_right },
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
        })
        .sort({
          comment_left: 1,
        });

      return comments;
    }

    const comments = await commentModel
      .find({
        comment_productId: productId,
        comment_parentId: parentCommentId || null,
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
      })
      .sort({
        comment_left: 1,
      });

    return comments;
  }

  static async deleteComments({ commentId, productId }: DeleteCommentsType) {
    // Check the product exists in db
    const foundProduct = await findProduct({ product_id: productId });

    if (!foundProduct) throw new NotFoundError("Product not found");

    const comment = await commentModel.findById(commentId);

    if (!comment) throw new NotFoundError("Comment not found");

    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;

    const width = rightValue - leftValue + 1;

    await commentModel.deleteMany({
      comment_productId: productId,
      comment_left: { $gte: leftValue, $lte: rightValue },
    });

    await commentModel.updateMany(
      {
        comment_productId: productId,
        comment_right: { $gt: rightValue },
      },
      {
        $inc: { comment_right: -width },
      }
    );

    await commentModel.updateMany(
      {
        comment_productId: productId,
        comment_left: { $gt: rightValue },
      },
      {
        $inc: { comment_left: -width },
      }
    );

    return true;
  }
}

export default CommentService;
