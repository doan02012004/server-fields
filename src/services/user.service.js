import UserModel from "../models/user.model.js"

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

export default {
    getAllUserService
}