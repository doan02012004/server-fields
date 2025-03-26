import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import { config } from "../configs/app.config.js";
import UserModel from "../models/user.model.js";
import jwt from 'jsonwebtoken'

const checkAuth =  catchAsync( async(req,res,next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Thiếu token hoặc token không hợp lệ");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.ACCESS_TOKEN_KEY);

        const user = await UserModel.findById(decoded.id);
        if (!user) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Người dùng không tồn tại");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Token không hợp lệ hoặc đã hết hạn");
    }
})

export default checkAuth