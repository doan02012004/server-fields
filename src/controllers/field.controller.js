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
    const fields = await fieldService.getAllFieldService()
    return  res.status(StatusCodes.OK).json({
        success: true,
        data:fields
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

export default {
    createFieldController,
    getAllFieldController,
    getFieldByIdController,
    UpdateFieldByIdController
}