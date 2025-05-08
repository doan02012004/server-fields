import { StatusCodes } from "http-status-codes"
import FieldModel from "../models/field.model.js"
import ApiError from "../utils/ApiError.js"
import RangePriceFieldModel from "../models/rangePriceField.model.js"
import mongoose from "mongoose"
import OrderFieldModel from "../models/order.model.js"

const createFieldService = async (data) => {
    const field = await FieldModel.create(data)
    if (!field) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Tạo sân bóng thất bại')
    }

    let rangePricesRes = []
    for (const rangePrice of data.rangePrices) {
        const newRangePrice = {...rangePrice,fieldId:field._id}
        const range = await RangePriceFieldModel.create(newRangePrice)
        if (!range) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Tạo khoảng giá sân bóng thất bại')
        }
        rangePricesRes.push(range.toObject())
    }

    return {
        ...field.toObject(),
        rangePrices:rangePricesRes
    }
}

const getAllFieldService = async() => {
    const fields = await FieldModel.aggregate([
        {
            $lookup:{
                from: 'range_price_fields',
                localField: '_id',
                foreignField: 'fieldId',
                as: 'rangePrices'
            }
        },
        {
            $lookup:{
                from: 'branchs',
                localField: 'branchId',
                foreignField: '_id',
                as: 'branch'
            }
        },
        {
            $unwind: "$branch" // Chuyển branch từ mảng thành object
        },
        {
            $project: {
                branchId:0,
                "branch.images":0,
                "branch.timeActive":0,
                "branch.description":0,
                "branch.diagramImage":0,
            }
        }
    ])

    return fields
}

const getFieldByIdService = async (id) => {
    const fieldId = new mongoose.Types.ObjectId(id);
    const fields = await FieldModel.aggregate([
        {
            $match:{
                _id:fieldId
            }
        },
        {
            $lookup:{
                from: 'range_price_fields',
                localField: '_id',
                foreignField: 'fieldId',
                pipeline: [
                    { $match: { deletedAt: null } } 
                  ],
                as: 'rangePrices'
            }
        }
    ])
    if(fields.length == 0) {
        throw new ApiError(StatusCodes.NOT_FOUND,'Sân bóng không tồn tại')
    }
    return fields[0]
}   

const updateFieldService = async (id,data) => {
    
    const field = await FieldModel.findByIdAndUpdate(id,data)
    if (!field) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Sân bóng không tồn tại')
    }
    let rangePricesRes = []
    for (const rangePrice of data.rangePrices) {
       if(rangePrice.field=='' || !rangePrice.field){
        const newRangePrice = {...rangePrice,fieldId:field._id}
        const range = await RangePriceFieldModel.create(newRangePrice)
        if (!range) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Cập nhật giá sân bóng thất bại')
        }
        rangePricesRes.push(range.toObject())
       }else if(rangePrice.field){
        const range = await RangePriceFieldModel.findByIdAndUpdate(rangePrice._id, rangePrice,{new:true})
        if (!range) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Cập nhật khoảng giá sân bóng thất bại')
        }
         rangePricesRes.push(range.toObject())
       }
       
    }
    const listIdRangePriceRes = rangePricesRes.map((item) => item._id)
    await RangePriceFieldModel.updateMany(
        {
            _id: { $nin: listIdRangePriceRes }, 
            fieldId: field._id,
            deletedAt: null
        },
        {
            $set: { deletedAt: new Date() } 
        }
    );
    
    return {
       ...field.toObject(),
       rangePrices:rangePricesRes
    }
}

const getAllOrderFieldByDateService = async (branchId, date) => {
    let startDate, endDate;

    if (date) {
        // Trường hợp có ngày cụ thể
        startDate = new Date(`${date}T00:00:00.000Z`);
        endDate = new Date(`${date}T23:59:59.999Z`);
    } else {
        // Trường hợp không có ngày: lấy từ hôm nay đến 7 ngày sau
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);

        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6); // +6 vì đã tính cả ngày hiện tại
        endDate.setHours(23, 59, 59, 999);
    }

    const ordersInDate = await OrderFieldModel.find({
        branchId,
        dayBookings: {
            $gte: startDate,
            $lte: endDate
        }
    })
    .populate('branchId fieldId timeId')
    .populate('userId','name');

    return ordersInDate;
}

export default {
    createFieldService,
    getAllFieldService,
    getFieldByIdService,
    updateFieldService,
    getAllOrderFieldByDateService
}