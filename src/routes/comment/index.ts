import { Router } from "express";
import { asyncHandler } from "../../helpers/asyncHandler";
import commentController from "../../controllers/comment.controller";
import { authentication } from "../../auth/authUtils";

const commentRoute = Router();

commentRoute.use(authentication);

commentRoute.post("/new", asyncHandler(commentController.createComment));
commentRoute.get("/", asyncHandler(commentController.getCommentByParentId));
commentRoute.delete("/", asyncHandler(commentController.deleteComments));

export default commentRoute;
