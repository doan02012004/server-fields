import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync.js"
import ApiError from "../utils/ApiError.js";
import userService from "../services/user.service.js";

const getMeController = catchAsync(async(req,res) => {
    const user = req.user;
    return res.status(StatusCodes.OK).json({
        user:{...user._doc, password: undefined,createdAt:undefined,updatedAt:undefined},
    })
})

const getAllUserController  = catchAsync(async(req,res) => {
    const user = req.user
    const {page,limit} = req.params
    // if(!user || user.role !== 'admin'){
    //     throw new ApiError(StatusCodes.UNAUTHORIZED, 'Bạn không có quyền truy cập')
    // }
    const result = await userService.getAllUserService(page,limit)
    return res.status(StatusCodes.OK).json({
      success:true,
      ...result
    })
})

const getUserByIdController = catchAsync(async(req,res) => {
    const userId = req.params.userId

    const user = await userService.getUserByIdService(userId) 
    return res.status(StatusCodes.OK).json({
        success:true,
        data:user
      })
})

const updateUserByIdController = catchAsync(async(req,res) => {
    const userId = req.params.userId
     const {status,name,email,phoneNumber,gender} = req.body
    const user = await userService.updateUserByIdService(userId,{status,name,email,phoneNumber,gender}) 
    return res.status(StatusCodes.OK).json({
        success:true,
        data:user
      })
})

const removeUserByIdController = catchAsync(async(req,res) => {
    const userId = req.params.userId
    const user = await userService.removeUserByIdService(userId) 
    return res.status(StatusCodes.OK).json({
        success:true,
        data:user
      })
})
export default {
    getMeController,
    getAllUserController,
    getUserByIdController,
    updateUserByIdController,
    removeUserByIdController
}