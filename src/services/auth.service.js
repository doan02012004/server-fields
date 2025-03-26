import UserModel from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import bcrypt from 'bcrypt'
import authSchema from "../schemas/auth.schema.js";
import { StatusCodes } from "http-status-codes";
import { config } from "../configs/app.config.js";
import jwt from 'jsonwebtoken'
import BlackListModel from "../models/black-list.model.js";

const registerService = async (newUser) => {
    //lấy schemma để validate
    const { error } = authSchema.registerSchema.validate(newUser, { abortEarly: false });
    if (error) {
        // Nếu có lỗi sẽ trả về tất cả lỗi
        throw new ApiError(StatusCodes.BAD_REQUEST, error.details.map(err => err.message));
    }

    const existUser = await UserModel.findOne({ email: newUser.email })
    //kiểm tra xem tk đã tồn tại chưa
    if (existUser) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'email đã tồn tại');
    }
    //mã hóa mật khẩu khẩu bằng jwt
    const hashPassword = await bcrypt.hash(newUser.password, 10)
    // ở đây thì ta sử dụng countDocuments để đọc số lượng trong collection user nếu như ko có thì tài khoản đầu tiên là "admin"
    const role = (await UserModel.countDocuments({})) === 0 ? "admin" : "user";

    //sau khi pass qua các bước trên thì ta sẽ tạo đc 1 tài khoản mới
    const userData = await UserModel.create({
        ...newUser,
        password: hashPassword,
        role
    })

    const reUser = userData.toObject()
    return {
        ...reUser,
        password: undefined
    };
}

const loginService = async (loginData) => {
    //lấy schemma để validate
    const { error } = authSchema.loginSchema.validate(loginData, { abortEarly: false });
    if (error) {
        // Nếu có lỗi sẽ trả về tất cả lỗi
        throw new ApiError(StatusCodes.UNAUTHORIZED, error.details.map(err => err.message));
    }

    const user = await UserModel.findOne({ email: loginData.email })

    //kiểm tra tài khoản đã tồn tại chưa thông qua email
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại');
    }
    const passwordCorrect = await bcrypt.compare(loginData.password, user?.password || "");
    //kiểm tra mật khẩu có đúng không giữa req người dùng nhập với pass có sẵn trong db
    if (!passwordCorrect) {
        throw new ApiError(StatusCodes.BAD_REQUEST).json({ error: "Sai mật khẩu" });
    }

    //accessToken
    const accessToken = generateAccessToken(user)
    //refreshToken  
    const refreshToken = generateRefreshToken(user)
   
    //trả về ko có mk
    const { password, ...orthers } = user._doc
    return {
        user: orthers,
        accessToken:accessToken,
        refreshToken:refreshToken
    }
}

const requestRefreshTokenService = async (accessToken,refreshToken) => {
        let newAccessToken = null
            if (!refreshToken) throw new ApiError(StatusCodes.FORBIDDEN,'Bạn chưa đăng nhập')
            const tokenBlackList = await BlackListModel.findOne({ token: refreshToken });
            if (tokenBlackList) {
                throw new ApiError(StatusCodes.FORBIDDEN,'refreshToken đã hết hạn')
            }
            
            if (accessToken) {
                jwt.verify(accessToken, config.ACCESS_TOKEN_KEY, (err, user) => {
                    if (err) {
                        jwt.verify(refreshToken,  config.REFRESH_TOKEN_KEY, (err, user) => {
                            if (err) {
                                throw new ApiError(StatusCodes.FORBIDDEN,'refreshToken đã hết hạn')
                            }
                            else {
                                //lọc token cũ ra 
                                 newAccessToken = generateAccessToken(user)
                            }
                        })
                    }
                    else {
                        newAccessToken = generateAccessToken(user)
                    }
                })
            } else {
                jwt.verify(refreshToken,   config.REFRESH_TOKEN_KEY, (err, user) => {
                    if (err) {
                        throw new ApiError(StatusCodes.FORBIDDEN,'refreshToken đã hết hạn')
                    }
                    //lọc token cũ ra 
                    // refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
                     newAccessToken = generateAccessToken(user)
                 
                })
            }

            return {
                accessToken:newAccessToken
            }
}
//tạo access token
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        config.ACCESS_TOKEN_KEY,
        { expiresIn: config.ACCESS_TOKEN_TIME, }
    )
}

//tạo refresh token
const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role
        },
        config.REFRESH_TOKEN_KEY,
        { expiresIn: config.REFRESH_TOKEN_TIME, }
    )
}


export default {
    registerService,
    loginService,
    requestRefreshTokenService
}