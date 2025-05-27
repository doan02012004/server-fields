import { StatusCodes } from "http-status-codes"
import ApiError from "../utils/ApiError.js"
import orderFieldSchema from "../schemas/orderField.schema.js"
import FieldModel from "../models/field.model.js"
import mongoose from "mongoose"
import getPrice from "../utils/get-price-field.js"
import dayjs from "dayjs"
import { dayInWeek, formatDateToCustomString, generateBookingCode, sortObject } from "../utils/constant.js"
import { config } from "../configs/app.config.js"
import SelectedTimeBranchModel from "../models/selectedTimeBranch.model.js"
import OrderFieldModel from "../models/order.model.js"
import dateFormat from 'dateformat';
import crypto from 'crypto';
import querystring from 'qs';




const getCheckoutOrderFieldService = async (fieldId, date, dayNumber, timeId) => {
    const newDate = new Date(date)
    const { error } = orderFieldSchema.checkInfoBookingSchema.validate({ fieldId, date: newDate, dayNumber, timeId }, { abortEarly: false })
    if (error) {
        // Nếu có lỗi sẽ trả về tất cả lỗi
        throw new ApiError(StatusCodes.BAD_REQUEST, error.details.map(err => err.message));
    }
    const timeSelected = await SelectedTimeBranchModel.findById(timeId)
    if (!timeSelected) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Giờ không hợp lệ");
    }
    const day = dayjs(date).day()
    if (day != dayNumber) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Ngày không hợp lệ");
    }

    const newfieldId = new mongoose.Types.ObjectId(fieldId);
    const field = await FieldModel.aggregate([
        {
            $match: {
                _id: newfieldId,
                deletedAt: null
            }
        },
        {
            $lookup: {
                from: 'branchs',
                localField: 'branchId',
                foreignField: '_id',
                as: 'branch'
            }
        },
        {
            $lookup: {
                from: 'range_price_fields',
                localField: '_id',
                foreignField: 'fieldId',
                pipeline: [
                    {
                        $match: {
                            deletedAt: null,
                            dayInWeek: { $in: [Number(dayNumber)] }
                        }
                    }
                ],
                as: 'rangePrices'
            }
        },
        {
            $unwind: "$branch" // Chuyển branch từ mảng thành object
        },
        {
            $project: {
                branchId: 0,
                "branch.images": 0,
                "branch.timeActive": 0,
                "branch.description": 0,
                "branch.diagramImage": 0,
            }
        }
    ])

    if (field.length == 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Sân bóng không tồn tại')
    }

    const reTimeSelected = timeSelected.toObject()
    const price = getPrice(field[0].rangePrices, reTimeSelected.startTime, reTimeSelected.endTime)
    const priceDeposit = Math.floor(price / 100 * Number(config.PRESENT_ORDER))
    return {
        item: field[0],
        price: price,
        date: date,
        dayNumber: dayNumber,
        dateFomat: dayjs(date).format('DD-MM-YYYY'),
        dayTextInWeek: dayInWeek[Number(dayNumber)],
        timeText: timeSelected.text,
        timeId: timeId,
        priceDeposit
    }
}

const createOrderFieldService = async (req) => {
    const { fieldId, dates, dayNumber, timeId, userId, branchId, priceDeposit, totalPrice, paymentMethod } = req.body
    const listDate = dates.map((item) => new Date(item))

    const { error } = orderFieldSchema.orderFieldSchema.validate({ fieldId, dayBookings: listDate, dayNumber, timeId, userId, branchId, priceDeposit, totalPrice, paymentMethod }, { abortEarly: false })
    if (error) {
        // Nếu có lỗi sẽ trả về tất cả lỗi
        throw new ApiError(StatusCodes.BAD_REQUEST, error.details.map(err => err.message));
    }
    const day = dayjs(dates[0]).day()
    if (day != dayNumber) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "Ngày không hợp lệ");
    }


    const orderCode = generateBookingCode()

    const newOrderField = new OrderFieldModel({
        fieldId: fieldId,
        dayBookings: listDate,
        dayNumber: Number(dayNumber),
        orderCode: orderCode,
        paymentMethod: paymentMethod,
        timeId: timeId,
        userId: userId,
        branchId: branchId,
        priceDeposit: priceDeposit,
        totalPrice: totalPrice
    })
    await newOrderField.save()

    return {
        ...newOrderField.toObject(),
    }
}
const createPaymentOrderFieldService = async (req) => {
    const ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    // Thông tin cấu hình VNPay
    const tmnCode = config.VNP_TMN_CODE;
    const secretKey = config.VNP_HASH_SECRET;
    const vnpUrl = config.VNP_URL;
    const returnUrl = config.VNP_RETURN_URL;
    const date = new Date();
    const createDate = dateFormat(date, 'yyyymmddHHmmss');
    const bankCode = "";
    const orderCode = req.body.orderCode;
    const orderInfo = 'Thanh toan cho ma GD:';
    const orderType = 'other';
    const vnpAmount = req.body.amount * 100; // Số tiền thanh toán (đơn vị: đồng)
    date.setMinutes(date.getMinutes() + 15);
    const expireDateFormat = formatDateToCustomString(date); // Định dạng thành yyyyMMddHHmmss
    let locale = "vn";
    if (!locale) locale = 'vn';
    const currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderCode;
    vnp_Params['vnp_OrderInfo'] = orderInfo;
    vnp_Params['vnp_OrderType'] = orderType;
    vnp_Params['vnp_Amount'] = vnpAmount;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_ExpireDate'] = expireDateFormat;
    if (bankCode) {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    // Sắp xếp các tham số
    vnp_Params = sortObject(vnp_Params);

    // Tạo chữ ký
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;

    // Tạo URL thanh toán
    const paymentUrl = `${vnpUrl}?${querystring.stringify(vnp_Params, { encode: false })}`;
    return {
        paymentUrl
    }
}

const GetVnpayReturnService = async (req) => {
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    const sortedParams = sortObject(vnp_Params);
    const signData = qs.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", config.VNP_HASH_SECRET);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        return {
            success: true,
            message: "Transaction successful",
        };
    } else {
        return {
            success: false,
            message: 'Invalid signature'
        };
    }
}

const GetVnpayIpnService = async (req) => {
    let respone = {
        success: true,
        message: 'success',
        RspCode: "00"
    }
    const vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const secretKey = config.VNP_HASH_SECRET;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    if (secureHash === signed) {
        var orderId = vnp_Params['vnp_TxnRef'];
        var rspCode = vnp_Params['vnp_ResponseCode'];
        //Kiem tra du lieu co hop le khong, cap nhat trang thai don hang va gui ket qua cho VNPAY theo dinh dang duoi
    }
    else {
        respone.success = false
        respone.message = 'Invalid signature'
        respone.RspCode = "97"
        // return respone
    }
    return respone
}
 const VnpayReturnService = async (req) => {
    let domainUrl = config.DOMAIN_ORIGIN;
    let vnp_Params = req.query;
    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);
    const tmnCode = config.VNP_TMN_CODE;
    const secretKey = config.VNP_HASH_SECRET;
    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    if (secureHash === signed) {
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        if (vnp_Params['vnp_ResponseCode'] === '00') {
            const orderCode = vnp_Params['vnp_TxnRef']
            const order = await OrderFieldModel.findOneAndUpdate({ orderCode: orderCode },{
                statusBooking: 'pending',
                paymentDate: new Date(),
            }, {
                new: true,
                runValidators: true
            })
            if (!order) {
                throw new ApiError(StatusCodes.BAD_REQUEST, 'Mã đơn hàng không tồn tại')
            }
            console.log('orderCode',orderCode)
            domainUrl += '/thanks'
            return domainUrl
        }
    }

    domainUrl += '/fail'

    return domainUrl
};

// admin

 const getOrderFieldAdminService = async (page, limit, status) => {
    const query = {
        deletedAt: null
    }
    if (status && status !=='all') {
        query['statusBooking'] = status
    }
    const skip = (page - 1) * limit
    const orders = await OrderFieldModel.find(query)
    .populate('userId', 'name email') // Chỉ lấy trường 'name' và 'email' từ bảng userId
    .populate('timeId','startTime endTime text') // Chỉ lấy 'startTime' và 'endTime' từ bảng timeId
    .populate('fieldId', 'name location') // Chỉ lấy 'name' và 'location' từ bảng fieldId
    .populate('branchId', 'name address') // Chỉ lấy 'name' và 'address' từ bảng branchId
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
    const total = await OrderFieldModel.countDocuments(query)
    
    const newOrders = orders.map((item) => {
        const reItem = item.toObject()
        return {
            ...reItem,
            dayBookings: reItem.dayBookings.map((item) => {
                const date = new Date(item)
                return dayjs(date).format('DD-MM-YYYY')
            })
        }
    })

    return {
        data: newOrders,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total: total,
            totalPage: Math.ceil(total / limit)
        }
    }
 }

 const getOrderFieldByIdAdminService = async (id) => {
    const order = await OrderFieldModel.findById(id)
    .populate('userId timeId branchId fieldId') 

    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Đơn hàng không tồn tại")
    }
    return order
 }

 const updateStatusOrderFieldAdminService = async (id, status) => {
    const order = await OrderFieldModel.findByIdAndUpdate(id, { statusBooking: status }, {
        new: true,
        runValidators: true
    }) 
    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Đơn hàng không tồn tại")
    }
    return order
}

const updateStatusOrderFieldService = async (id, status) => {
    const order = await OrderFieldModel.findByIdAndUpdate(id, { statusBooking: status }, {
        new: true,
        runValidators: true
    }) 
    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Đơn hàng không tồn tại")
    }
    return order
}

const getAllOrderFieldByUserIdService = async (page,limit,userId,statusBooking) => {
    const skip = (page - 1) * limit
    const query = {
        userId: userId,
        deletedAt: null,
        statusBooking: { $ne: 'unpaid' }
    }

    if(statusBooking !== "all"){
        query['statusBooking'] = statusBooking
    }

    const orders = await OrderFieldModel.find(query)
    .populate('userId', 'name email') // Chỉ lấy trường 'name' và 'email' từ bảng userId
    .populate('timeId','startTime endTime text') // Chỉ lấy 'startTime' và 'endTime' từ bảng timeId
    .populate('fieldId', 'name location') // Chỉ lấy 'name' và 'location' từ bảng fieldId
    .populate('branchId', 'name address') // Chỉ lấy 'name' và 'address' từ bảng branchId
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    const total = await OrderFieldModel.countDocuments(query)
    
    return {
        data: orders,
        pagination: {
            page: Number(page),
            limit: Number(limit),
            total: total,
            totalPage: Math.ceil(total / limit)
        }
    }
 }
const getOrderFieldByOrderCodeService = async (orderCode) => {
    const order = await OrderFieldModel.findOne({ orderCode: orderCode})
    .populate('userId', 'name email phoneNumber') // Chỉ lấy trường 'name' và 'email' từ bảng userId
    .populate('timeId','startTime endTime text') // Chỉ lấy 'startTime' và 'endTime' từ bảng timeId
    .populate('fieldId', 'name location') // Chỉ lấy 'name' và 'location' từ bảng fieldId
    .populate('branchId', 'name address_text') // Chỉ lấy 'name' và 'address' từ bảng branchId

    if (!order) {
        throw new ApiError(StatusCodes.NOT_FOUND, "Đơn hàng không tồn tại")
    }
    return order
 }
export default {
    getCheckoutOrderFieldService,
    createPaymentOrderFieldService,
    GetVnpayReturnService,
    createOrderFieldService,
    GetVnpayIpnService,
    VnpayReturnService,
    getOrderFieldAdminService,
    getOrderFieldByIdAdminService,
    updateStatusOrderFieldAdminService,
    updateStatusOrderFieldService,
    getOrderFieldByOrderCodeService,
    getAllOrderFieldByUserIdService
}