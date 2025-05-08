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
export default {
    getMeController,
    getAllUserController
}