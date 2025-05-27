
import { StatusCodes } from "http-status-codes"
import catchAsync from "../utils/catchAsync.js"
import orderFieldService from "../services/orderField.service.js"
import OrderFieldModel from "../models/order.model.js"
import ApiError from "../utils/ApiError.js"

const getCheckoutOrderFieldController = catchAsync(async (req, res) => {
    const { fieldId, date, dayNumber, timeId } = req.query
    const result = await orderFieldService.getCheckoutOrderFieldService(fieldId, date, dayNumber, timeId)
    return res.status(StatusCodes.OK).json({
        success: true,
        data: result
    })
})

const createPaymentOrderFieldController = catchAsync(async (req, res) => {
    const result = await orderFieldService.createPaymentOrderFieldService(req)
    return res.status(StatusCodes.OK).json({
        success: true,
        data: result
    })
})

const GetVnpayResultController = catchAsync(async (req, res) => {
    const result = await orderFieldService.GetVnpayReturnService(req)
    return res.status(StatusCodes.OK).json({
        success: true,
        data: result
    })
})

const createFieldOrderController = catchAsync(async (req, res) => {
    const result = await orderFieldService.createOrderFieldService(req)
    return res.status(StatusCodes.OK).json({
        success: true,
        data: result
    })
})

const GetVnpayIpnController = catchAsync(async (req, res) => {
    const result = await orderFieldService.GetVnpayIpnService(req)
    return res.status(StatusCodes.OK).json({
        success: true,
        data: result
    })
})
const VnpayReturnController = catchAsync(async (req, res) => {
    const url = await orderFieldService.VnpayReturnService(req)
    return res.redirect(url)
})

// admin

const GetOrderFieldAdminController = catchAsync(async (req, res) => {
    const { page, limit, statusBooking } = req.query
    const currentPage = Number(page) || 1;
    const limitPage = Number(limit) || 10;
    const result = await orderFieldService.getOrderFieldAdminService(currentPage, limitPage, statusBooking)
    return res.status(StatusCodes.OK).json({
        success: true,
        ...result
    })
})

const GetOrderFieldByIdAdminController = catchAsync(async (req, res) => {
    const { id } = req.params
    const result = await orderFieldService.getOrderFieldByIdAdminService(id)
    return res.status(StatusCodes.OK).json({
        success: true,
        data: result
    })
})

const UpdateStatusOrderFieldAdminController = catchAsync(async (req, res) => {
    const { id } = req.params
    const { statusBooking } = req.body
    const result = await orderFieldService.updateStatusOrderFieldAdminService(id, statusBooking)
    return res.status(StatusCodes.OK).json({
        success: true,
        data: result
    })
})

const UpdateStatusOrderFieldController = catchAsync(async (req, res) => {
    const { id } = req.params
    const { statusBooking } = req.body
    const result = await orderFieldService.updateStatusOrderFieldService(id, statusBooking)
    return res.status(StatusCodes.OK).json({
        success: true,
        data: result
    })
})

const GetAllOrderFieldByUserIdController = catchAsync(async (req, res) => {
    const { page, limit, statusBooking } = req.query
    const currentPage = Number(page) || 1;
    const limitPage = Number(limit) || 10;
    const result = await orderFieldService.getAllOrderFieldByUserIdService(currentPage, limitPage, req.user?._id, statusBooking)
    return res.status(StatusCodes.OK).json({
        success: true,
        ...result
    })
})

const GetOrderFieldByOrderCodeController = catchAsync(async (req, res) => {
    const { orderCode } = req.params
    const result = await orderFieldService.getOrderFieldByOrderCodeService(orderCode)
    return res.status(StatusCodes.OK).json({
        success: true,
        data: result
    })
})


const getFutureOrdersByUserController = catchAsync(async (req, res) => {
    const userId  = req?.user?._id;

    if (!userId) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Thiếu userId");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // reset về đầu ngày

    // Tìm đơn có ít nhất 1 ngày đặt từ hôm nay trở đi
    const orders = await OrderFieldModel.find({
        userId,
        dayBookings: { $elemMatch: { $gte: today } },
        statusBooking: { $in: ['pending', 'confirmed'] }
    })
        .populate('userId', 'name email')
        .populate('timeId') 
        .populate('fieldId', 'name location')
        .populate('branchId', 'name images address_text')
        .sort({ createdAt: -1 });

    return res.status(StatusCodes.OK).json({
        success: true,
        data: orders,
    });
});
export default {
    getCheckoutOrderFieldController,
    createPaymentOrderFieldController,
    GetVnpayResultController,
    createFieldOrderController,
    VnpayReturnController,
    GetOrderFieldAdminController,
    GetOrderFieldByIdAdminController,
    UpdateStatusOrderFieldAdminController,
    UpdateStatusOrderFieldController,
    GetAllOrderFieldByUserIdController,
    GetOrderFieldByOrderCodeController,
    getFutureOrdersByUserController
}