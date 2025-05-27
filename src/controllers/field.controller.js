import { StatusCodes } from "http-status-codes"
import catchAsync from "../utils/catchAsync.js"
import fieldService from "../services/field.service.js"

const createFieldController = async (req, res, next) => {
    try {
        const field = await fieldService.createFieldService(req.body)
        return res.status(StatusCodes.CREATED).json({
            success: true,
            data:field
        })
    } catch (error) {
        next(error)
    }
}

const getAllFieldController = catchAsync(async(req,res) => {
    const { page, limit } = req.query
    const pageNumber = parseInt(page) || 1
    const limitNumber = parseInt(limit) || 10
    const fields = await fieldService.getAllFieldService(pageNumber,limitNumber)
    return  res.status(StatusCodes.OK).json({
        success: true,
       ...fields
    })
})

const getFieldByIdController = catchAsync(async(req,res) => {
    const field = await fieldService.getFieldByIdService(req.params.id)
    return  res.status(StatusCodes.OK).json({
        success: true,
        data:field
    })
})

const UpdateFieldByIdController = catchAsync(async(req,res) => {
    const field = await fieldService.updateFieldService(req.params.id,req.body)
    return  res.status(StatusCodes.OK).json({
        success: true,
        data:field
    })
})

const getAllOrderFieldByDateController = catchAsync(async(req,res) => {
    const {branchId, date } = req.query
    const result = await fieldService.getAllOrderFieldByDateService(branchId, date)
    return res.status(StatusCodes.OK).json({
        success: true,
        data: result
    })
})

const removeFieldByIdController = catchAsync(async(req,res) => {
    const field = await fieldService.removeFieldByIdService(req.params.id)
    return  res.status(StatusCodes.OK).json({
        success: true,
        data:field
    })
})
export default {
    createFieldController,
    getAllFieldController,
    getFieldByIdController,
    UpdateFieldByIdController,
    getAllOrderFieldByDateController,
    removeFieldByIdController
}