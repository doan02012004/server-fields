import { StatusCodes } from "http-status-codes"
import typeFieldService from "../services/typeField.service.js"
import catchAsync from "../utils/catchAsync.js"


const createTypeFieldController = catchAsync(async(req,res) => {
    const typeField = await typeFieldService.createTypeFieldService(req.body)
    return res.status(StatusCodes.CREATED).json({
        success:true,
        data:typeField
    })
})


const getAllTypeFieldController = catchAsync(async(req,res) => {
    const typeFields = await typeFieldService.getAllTypeFieldService()
    return res.status(StatusCodes.OK).json({
        success:true,
        data:typeFields
    })
})

export default {
    createTypeFieldController,
    getAllTypeFieldController
}