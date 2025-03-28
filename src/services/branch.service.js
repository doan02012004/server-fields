import { StatusCodes } from "http-status-codes";
import branchSchema from "../schemas/branch.schema.js";
import ApiError from "../utils/ApiError.js";
import BranchModel from "../models/branch.model.js";

const createBranchService = async (branch) => {
      //lấy schemma để validate
      const { error } = branchSchema.branchSchema.validate(branch, { abortEarly: false });
      if (error) {
          // Nếu có lỗi sẽ trả về tất cả lỗi
          throw new ApiError(StatusCodes.BAD_REQUEST, error.details.map(err => err.message));
      }
      const newBranch = await BranchModel.create(branch)

      return {
        branch: newBranch.toObject()
      }
}

const getAllBranchService = async () => {
    const branchs = await BranchModel.find()
    return branchs
}

const getBranchByIdService = async (id) => {
    const branch = await BranchModel.findById(id)
    if(!branch){
        throw new ApiError(StatusCodes.NOT_FOUND,'Cơ sở này không tồn tại');
    }
    return branch
}

const updateBranchService = async (newBranch) => {
    const branch = await BranchModel.findByIdAndUpdate(newBranch._id, newBranch,{new:true})
    if(!branch){
        throw new ApiError(StatusCodes.NOT_FOUND,'Cơ sở này không tồn tại');
    }
    return branch
}
export default {
    createBranchService,
    getAllBranchService,
    getBranchByIdService,
    updateBranchService
}