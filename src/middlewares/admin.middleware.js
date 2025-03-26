import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";


const checkAdmin = catchAsync( async(req,res,next) => {
    if(!req.user){
        throw new ApiError(StatusCodes.FORBIDDEN,'Tài khoản không tồn tại')
    }

    if(req.user.role !=='admin'){
        throw new ApiError(StatusCodes.FORBIDDEN,'Tài khoản không được phép')
    }

    next()
})

export default checkAdmin