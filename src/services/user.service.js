import { StatusCodes } from "http-status-codes";
import UserModel from "../models/user.model.js"
import ApiError from "../utils/ApiError.js";
import mongoose from "mongoose";
import OrderFieldModel from "../models/order.model.js";

const getAllUserService = async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        UserModel.find().select('-password').skip(skip).limit(limit),
        UserModel.countDocuments()
    ]);

    return {
        data: users,
        pagination: {
            total,
            page,
            totalPages: Math.ceil(total / limit),
        }
    };
}

const getUserByIdService = async(userId) => {
    const user = await UserModel.findById(userId).select('-password')
    if(!user){
        throw new ApiError(StatusCodes.NOT_FOUND,"Người dùng không tồn tại")
    }

    return user.toObject()
}

const updateUserByIdService = async(userId,newData) => {
    const user = await UserModel.findByIdAndUpdate(userId,newData,{new:true}).select('-password')
    if(!user){
        throw new ApiError(StatusCodes.NOT_FOUND,"Người dùng không tồn tại")
    }

    return user.toObject()
}

const removeUserByIdService = async(userId) => {

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "ID người dùng không hợp lệ");
    }
    const checkOrder = await OrderFieldModel.findOne({userId:userId})
    if(checkOrder){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Không thể xóa được người dùng này");
    }
    const currentDate = new Date();

    const user = await UserModel.findOneAndUpdate(
        { _id: userId, deletedAt: null }, // chỉ xóa nếu chưa bị xóa
        { deletedAt: currentDate },
        { new: true }
    ).select('-password');


    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Người dùng không tồn tại hoặc đã bị xóa");
    }

    return user.toObject();
}

export default {
    getAllUserService,
    getUserByIdService,
    updateUserByIdService,
    removeUserByIdService
}