import { StatusCodes } from "http-status-codes"
import branchService from "../services/branch.service.js"
import catchAsync from "../utils/catchAsync.js"
import ApiError from "../utils/ApiError.js"

const createBranchController = catchAsync(async(req,res) => {
    const result = await branchService.createBranchService(req.body) 
    return res.status(StatusCodes.CREATED).json(result)
})

const getAllBranchController = catchAsync(async(req,res) => {
    const branchs = await branchService.getAllBranchService() 
    return res.status(StatusCodes.CREATED).json({
        branchs
    })
})

const getBranchByIdController = catchAsync(async(req,res) => {
   const branch = await branchService.getBranchByIdService(req.params.id)
    return res.status(StatusCodes.CREATED).json({
        branch
    })
})

const updateBranchController = catchAsync(async(req,res) => {
    const id = req.params.id
    if(!id){
        throw new ApiError(StatusCodes.NOT_FOUND,'Cơ sở này không tồn tại')
    }
    const newBranch = {
        _id:id,
        ...req.body
    }
    const branch = await branchService.updateBranchService(newBranch)
     return res.status(StatusCodes.CREATED).json({
        branch
     })
 })
export default {
    createBranchController,
    getAllBranchController,
    getBranchByIdController,
    updateBranchController
}