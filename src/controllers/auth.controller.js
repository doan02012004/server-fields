import { StatusCodes } from "http-status-codes"
import authService from "../services/auth.service.js"
import catchAsync from "../utils/catchAsync.js"
import BlackListModel from "../models/black-list.model.js"
import ApiError from "../utils/ApiError.js"

//đăng kí tài khoản
const registerController = catchAsync(async (req, res) => {
    const user = await authService.registerService(req.body)

    return res.status(StatusCodes.CREATED).json({
        success: true,
        data: user
    })
})


// đăng nhập tài khoản
const loginController = catchAsync(async (req, res) => {
    const result = await authService.loginService(req.body)
    res.cookie('refreshToken', result.refreshToken, {
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
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;
    const result = await authService.requestRefreshTokenService(accessToken, refreshToken)
    res.cookie('accessToken', result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    })
    return res.status(StatusCodes.OK).json({
        success: true,
        accessToken: result.accessToken
    })
})

// đăng xuất tài khoản
const logoutController = catchAsync(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    // Kiểm tra nếu không có cookie accessToken và refreshToken
    if (!req.cookies.accessToken || !refreshToken) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng chưa đăng nhập hoặc token không tồn tại")
    }

    await BlackListModel.create({ token: refreshToken });

    // Xóa token khỏi cookies
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(StatusCodes.OK).json({
        success: true,
        message: "Đăng xuất thành công"
    });
})

const changePasswordController = catchAsync(async (req, res) => {
    const { userId } = req.params
    const { currentPassword, newPassword } = req.body
    const result = await authService.changePasswordService(userId, currentPassword, newPassword)

    return res.status(StatusCodes.OK).json({
        success: true,
        ...result
    })
})

export default {
    registerController,
    loginController,
    logoutController,
    requestRefreshToken,
    changePasswordController
}