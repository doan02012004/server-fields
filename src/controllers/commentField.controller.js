import CommentFieldModel from "../models/commentField.model.js";
import OrderFieldModel from "../models/order.model.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { StatusCodes } from "http-status-codes";

 const createCommentFieldController = catchAsync(async (req, res) => {
 const { userId, branchId, fieldId,orderFieldId, rating, content } = req.body

    if (!userId || !branchId || !fieldId || !content || !orderFieldId) {
      throw new ApiError(StatusCodes.BAD_REQUEST,"Thông tin không hợp lệ")
    }

    const newComment = await CommentFieldModel.create({
      userId,
      branchId,
      fieldId,
      orderFieldId,
      rating,
      content,
    })

    if(newComment){
      await OrderFieldModel.findByIdAndUpdate(orderFieldId,{
        isRating:true
      })
    }
    
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'Tạo bình luận thành công.',
      data: newComment,
    })
})


const getCommentsByBranchIdController = catchAsync(async (req, res) => {
  const { branchId } = req.params;
  const comments = await CommentFieldModel.find({ 
    branchId, 
    // isPublic: true, 
    deletedAt: null 
  })
    .populate('userId', 'name')
    .populate('fieldId', 'name')
    .sort({ createdAt: -1 });

  return res.status(StatusCodes.OK).json({
    success: true,
    data: comments
  });
});


const toggleLikeCommentController = catchAsync(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  const comment = await CommentFieldModel.findById(commentId);
  if (!comment) throw new ApiError(StatusCodes.NOT_FOUND, 'Bình luận không tồn tại');

  const hasLiked = comment.likes.includes(userId);
  if (hasLiked) {
    comment.likes.pull(userId);
  } else {
    comment.likes.push(userId);
  }
  await comment.save();

  return res.status(StatusCodes.OK).json({
    success: true,
    liked: !hasLiked
  });
});

export default {
    createCommentFieldController,
    getCommentsByBranchIdController,
    toggleLikeCommentController
}