import { StatusCodes } from "http-status-codes";
import typeFieldSchema from "../schemas/typeField.schema.js";
import ApiError from "../utils/ApiError.js";
import TypeFieldModel from "../models/typeField.model.js";

const createTypeFieldService = async(data) => {
    const { error } = typeFieldSchema.typeFieldSchema.validate(data, { abortEarly: false });
    if (error) {
        // Nếu có lỗi sẽ trả về tất cả lỗi
        throw new ApiError(StatusCodes.BAD_REQUEST, error.details.map(err => err.message));
    }
    const existField = await TypeFieldModel.findOne({playerNumber:data.playerNumber})
    if(existField){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Loại sân này đã tồn tại");
    }
    const typeField = await TypeFieldModel.create(data)
    if(!typeField){
        throw new ApiError(StatusCodes.BAD_REQUEST, "Tạo loại sân không thành công");
    }

    return typeField
}

const getAllTypeFieldService = async() => {

    const typeFields = await TypeFieldModel.find()

    return typeFields
}


export default {
    createTypeFieldService,
    getAllTypeFieldService
}