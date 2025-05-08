import { StatusCodes } from "http-status-codes";
import branchSchema from "../schemas/branch.schema.js";
import ApiError from "../utils/ApiError.js";
import BranchModel from "../models/branch.model.js";
import FieldModel from "../models/field.model.js";
import dayjs from 'dayjs'
import { dayInWeek, generateTextByMinutes, isSameDay } from "../utils/constant.js";
import RangePriceFieldModel from "../models/rangePriceField.model.js";
import getPrice from "../utils/get-price-field.js";
import SelectedTimeBranchModel from "../models/selectedTimeBranch.model.js";
import OrderFieldModel from "../models/order.model.js";

const createBranchService = async (branch) => {
    //lấy schemma để validate
    const { error } = branchSchema.branchSchema.validate(branch, { abortEarly: false });
    if (error) {
        // Nếu có lỗi sẽ trả về tất cả lỗi
        throw new ApiError(StatusCodes.BAD_REQUEST, error.details.map(err => err.message));
    }
    const newBranch = await BranchModel.create(branch)
    if (!newBranch) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Tạo cơ sở thất bại')
    }
    let selectTimesRes = []
    for (const rangeTime of branch.selectTimes) {
        const newRangeTime = { ...rangeTime, branchId: newBranch._id }
        const range = await SelectedTimeBranchModel.create(newRangeTime)
        if (!range) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'Tạo khoảng thời gian cơ sở thất bại')
        }
        selectTimesRes.push(range.toObject())
    }
    return {
        branch: {
            ...newBranch.toObject(),
            selectTimes: selectTimesRes
        }
    }
}

const getAllBranchService = async () => {
    const branchs = await BranchModel.find()
    return branchs
}

const getBranchByIdService = async (id) => {
    const branch = await BranchModel.findById(id)
    if (!branch) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Cơ sở này không tồn tại');
    }
    const selectTimes = await SelectedTimeBranchModel.find({ branchId: id, deletedAt: null })
    if (!selectTimes) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Chưa có khoảng thời gian nào');
    }
    return {
        ...branch.toObject(),
        selectTimes: selectTimes
    }
}

const updateBranchService = async (newBranch) => {
    const branch = await BranchModel.findByIdAndUpdate(newBranch._id, newBranch, { new: true })
    if (!branch) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Cơ sở này không tồn tại');
    }
    // B1: Lấy tất cả tags hiện có (chưa bị xóa mềm)
    const existSelectTimes = await SelectedTimeBranchModel.find({ branchId: newBranch._id, deletedAt: null });
    const existingSelectTimeIds = existSelectTimes.map(selectTime => selectTime._id.toString());

    // B2: Phân loại
    const currentSelectTimesId = newBranch.selectTimes.map(ite => ite._id.toString())
    const toInsert = currentSelectTimesId.filter(id => !existingSelectTimeIds.includes(id));
    const toDelete = existingSelectTimeIds.filter(id => !currentSelectTimesId.includes(id));

    // B3: Tạo danh sách thao tác bulk
    let operations = [];

    // Insert những cái mới
    for (const id of toInsert) {
        const selectTime = newBranch.selectTimes.find(item => item._id.toString() === id);
        if (selectTime) {
            operations.push({
                insertOne: {
                    document: {
                        branchId: newBranch._id,
                        startTime: selectTime.startTime,
                        endTime: selectTime.endTime,
                        text: selectTime.text,
                        createdAt: new Date(),
                        deletedAt: null,
                    },
                },
            });
        }
    }

    // Cập nhật deletedAt cho những cái đã bị xóa

    toDelete.forEach(id => {
        operations.push({
            updateOne: {
                filter: { _id: id },
                update: { $set: { deletedAt: new Date() } },
            },
        });
    });

    // B4: Thực thi nếu có thay đổi
    if (operations.length > 0) {
        await SelectedTimeBranchModel.bulkWrite(operations);
    }
    return branch
}

const getBranchBySlugViewWebService = async (branchSlug, selectedFieldId, selectedDate, selectedTimeId) => {
    // get Field
    const branch = await BranchModel.findOne({ slug: branchSlug })
    if (!branch) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Cơ sở không tồn tại')
    }
    // tạo ra các select sân bóng
    const listField = await getListFieldAndSelectedFieldService(branch._id, selectedFieldId)

    // tạo ra các select ngày đặt sân
    const listDate = await getListDateAndSelectedDateService(selectedDate, branch._id, selectedFieldId, selectedTimeId)

    // Tìm ra sân bóng được chọn
    const fieldSelected = listField.find((item) => item.selected == true)

    // Tìm ra lịch được chọn
    const dateSelected = listDate.find((item) => item.selected == true)

    // Tìm ra khoảng thời gian được chọn
    const listTime = await getListSelectedTimesService(branch._id, selectedTimeId,selectedDate,selectedFieldId)
    // lấy khoảng giá của sân và ngày đó
    const day = dateSelected ? dateSelected.dayNumber : dayjs().day()
    let rangePrices = []
    if (fieldSelected) {
        const getRangePrice = await RangePriceFieldModel.find({
            fieldId: fieldSelected?._id,
            dayInWeek: { $in: [day] },
            deletedAt: null
        })
        if (getRangePrice.length > 0) {
            rangePrices = getRangePrice.map((item) => item.toObject())
        }
    }

    const price_infos = await getPriceInfos(rangePrices)

    // Tìm ra khoảng thời gian được chọn
    const timeSelected = listTime.find((item) => item.selected == true)
    const caculatePrice = getPrice(rangePrices, timeSelected?.startTime, timeSelected?.endTime)

    return {
        item: branch,
        listField: listField,
        listDate: listDate,
        listTime: listTime,
        price_infos: price_infos,
        price: caculatePrice
    }
}

const getListFieldAndSelectedFieldService = async (branchId, selectedFieldId) => {
    const fields = await FieldModel.find({
        branchId: branchId
    })

    if (fields.length == 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Chưa có sân bóng nào')
    }

    const newSelectedField = fields.map((item) => ({
        _id: item._id.toString(),
        name: item.toObject().name,
        images: item.toObject().images,
        selected: item._id.toString() === selectedFieldId
    }))

    return newSelectedField
}

const getListDateAndSelectedDateService = async (selectedDate, branchId, selectFieldId, timeId) => {

    let checkBookings = []

    if (selectFieldId || timeId) {
        const startDate = new Date(); // thời điểm hiện tại
        startDate.setHours(0, 0, 0, 0); // đảm bảo bắt đầu từ đầu ngày

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999); // kết thúc cuối ngày thứ 7

        const checkOrder = await OrderFieldModel.find({
            branchId,
            fieldId: selectFieldId,
            timeId,
            dayBookings: {
                $gte: startDate,
                $lte: endDate
            }
        });

        // Lọc ra các ngày không trùng từ `dayBookings`
        const uniqueDates = new Set(
            checkOrder.map(order => {
                const reOrder = order.toObject()
                return new Date(reOrder.dayBookings).toISOString().split('T')[0]
            })
        );

        checkBookings = Array.from(uniqueDates); // mảng các ngày không trùng lặp, dạng yyyy-mm-dd

    }
    const next7Days = Array.from({ length: 7 }, (_, i) => {
        const date = dayjs().add(i, "day")
        const day = date.day()
        const formatDate = date.format('DD-MM-YYYY')
        let disabled = false
        
        // Nếu có field và time, kiểm tra disable theo ngày đã đặt
        if (selectFieldId && timeId) {
            if (checkBookings.length > 0) {
                const formatDate2 =  date.format('YYYY-MM-DD')
                disabled = checkBookings.includes(formatDate2)
            }
        }

        return {
            dateDefault: date,
            dayNumber: day,
            date: formatDate,
            disabled: disabled,
            textDayInWeek: dayInWeek[day],
            selected: isSameDay(selectedDate, formatDate)
        }
    })
    return next7Days
}

const getListSelectedTimesService = async (branchId, selectedTimeId,date,fieldId) => {
    const selectedTimes = await SelectedTimeBranchModel.find({ branchId: branchId, deletedAt: null })
    if (selectedTimes.length == 0) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Chưa có khoảng thời gian nào')
    }
    let disabledTimeIds = [];

    if (branchId && fieldId && date) {
        const [day, month, year] = date.split("-");
        const selectedDate = new Date(`${year}-${month}-${day}`);
        const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));

        const bookedOrders = await OrderFieldModel.find({
            branchId,
            fieldId,
            dayBookings: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        disabledTimeIds = bookedOrders.map(order => order.timeId.toString());
    }

    const newSelectedTimes = selectedTimes.map((item) => ({
        _id: item._id.toString(),
        startTime: item.startTime,
        endTime: item.endTime,
        text: item.text,
        disabled: disabledTimeIds.includes(item._id.toString()),
        selected: item._id.toString() === selectedTimeId
    }));

    return newSelectedTimes;
}


const getPriceInfos = async (rangePrices) => {
    let price_infos = []
    if (rangePrices.length == 0) {
        return price_infos
    }
    price_infos = rangePrices.map((item) => (
        {
            label: item.title,
            value: item.price
        }
    ))
    return price_infos
}

const checkBookingService = async (fieldId, date, timeId) => {
    const fixed = date.split('T')[0]; // '2025-04-25'
    const startDate = new Date(`${fixed}T00:00:00.000Z`); // UTC 0h00
    const endDate = new Date(`${fixed}T23:59:59.999Z`);  // UTC 23h59
    const checkBooking = await OrderFieldModel.findOne({
        fieldId: fieldId,
        timeId: timeId,
        dayBookings: {
            $gte: startDate,
            $lte: endDate
        }
    })
    if (checkBooking) {
        throw new ApiError(StatusCodes.BAD_REQUEST, 'Đã tồn tại lịch đặt sân này')
    }
    const timeSelected = await SelectedTimeBranchModel.findById(timeId)
    if (!timeSelected) {
        throw new ApiError(StatusCodes.NOT_FOUND, 'Khoảng thời gian không tồn tại')
    }
    return {
        fieldId: fieldId,
        date: date,
        timeId: timeId,
        dayNumber: dayjs(date).day()
    }
}
export default {
    createBranchService,
    getAllBranchService,
    getBranchByIdService,
    updateBranchService,
    getBranchBySlugViewWebService,
    checkBookingService
}