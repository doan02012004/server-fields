import { StatusCodes } from "http-status-codes";
import catchAsync from "../utils/catchAsync.js"

const getMeController = catchAsync(async(req,res) => {
    const user = req.user;
    return res.status(StatusCodes.OK).json({
        user:user
    })
})

export default {
    getMeController
}