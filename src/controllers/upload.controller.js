import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/ApiError.js"
import { uploadFileService } from "../services/upload.service.js"
import catchAsync from "../utils/catchAsync.js"

 const uploadFileController = catchAsync(async(req , res,next) => {
    if(!req.file){
        throw new ApiError(StatusCodes.NOT_FOUND, 'không có file')
    }
    const result = await uploadFileService(req.file)
    return res.status(StatusCodes.CREATED).json(result)
})


export default {
    uploadFileController
}