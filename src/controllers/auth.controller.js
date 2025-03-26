import { StatusCodes } from "http-status-codes"
import authService from "../services/auth.service.js"
import catchAsync from "../utils/catchAsync.js"
import BlackListModel from "../models/black-list.model.js"
import ApiError from "../utils/ApiError.js"

//đăng kí tài khoản
const registerController = catchAsync(async (req, res) => {
    const user = await authService.registerService(req.body)

    return res.status(StatusCodes.CREATED).json({
        user
    })
})


// đăng nhập tài khoản
const loginController = catchAsync(async (req, res) => {
    const result = await authService.loginService(req.body)
    res.cookie('refeshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,// Thời gian sống của cookie, ví dụ: 1 ngày
    })
    res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,// Thời gian sống của cookie, ví dụ: 1 ngày
    })
    return res.status(StatusCodes.OK).json(result)
})

export const requestRefreshToken = catchAsync(async (req, res) => {
    const refreshToken = req.cookies.refeshToken;
    const accessToken = req.cookies.accessToken;
    const result = await authService.requestRefreshTokenService(accessToken, refreshToken)
    res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
    return res.status(StatusCodes.OK).json({
        success:true
    })
})

// đăng xuất tài khoản
const logoutController = catchAsync(async (req, res) => {
    const refreshToken = req.cookies.refeshToken;
    // Kiểm tra nếu không có cookie accessToken và refreshToken
    if (!req.cookies.accessToken || !refreshToken) {
      throw new ApiError(StatusCodes.NOT_FOUND,"Người dùng chưa đăng nhập hoặc token không tồn tại")
    }

    await BlackListModel.create({ token: refreshToken });

    // Xóa token khỏi cookies
    res.clearCookie('accessToken');
    res.clearCookie('refeshToken');

    return res.status(StatusCodes.OK).json({
        SC: 1,
        message: "Đăng xuất thành công"
    });
})


export default {
    registerController,
    loginController,
    logoutController,
    requestRefreshToken
}