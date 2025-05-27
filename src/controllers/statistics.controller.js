import { StatusCodes } from "http-status-codes";
import OrderFieldModel from "../models/order.model.js";
import catchAsync from "../utils/catchAsync.js";
import { getMonthRange } from "../utils/constant.js";
import UserModel from "../models/user.model.js";

const getMonthlyRevenue = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  const { start, end } = getMonthRange(month, year);

  const result = await OrderFieldModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lt: end },
        statusBooking: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$totalPrice" },
        totalDeposit: { $sum: "$priceDeposit" },
        count: { $sum: 1 }
      }
    }
  ]);
  const response = result[0] || { totalRevenue: 0, totalDeposit: 0, count: 0 }
  return res.status(StatusCodes.OK).json({
    success: true,
    data: response
  });
})

const getSuccessBookings = catchAsync(async (req, res) => {
  const { month, year } = req.query;
  const { start, end } = getMonthRange(month, year);

  const count = await OrderFieldModel.countDocuments({
    createdAt: { $gte: start, $lt: end },
    statusBooking: { $in: ['confirmed', 'completed'] }
  });
  return res.status(StatusCodes.OK).json({
    success: true,
    data: { successBookings: count }
  });
})

const getPendingBookings = async (req, res) => {
  const { month, year } = req.query;
  const { start, end } = getMonthRange(month, year);

  const count = await OrderFieldModel.countDocuments({
    createdAt: { $gte: start, $lt: end },
    statusBooking: { $in: ['pending'] }
  });

  return res.status(StatusCodes.OK).json({
    success: true,
    data: { pendingBookings: count }
  });

};
const getTopUsers = async (req, res) => {
  const { month, year } = req.query;
  const { start, end } = getMonthRange(month, year);

  const topUsers = await OrderFieldModel.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lt: end },
        statusBooking: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $group: {
        _id: "$userId",
        bookingCount: { $sum: 1 }
      }
    },
    { $sort: { bookingCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $project: {
        _id: 0,
        userId: '$user._id',
        name: '$user.name',
        email: '$user.email',
        phoneNumber: '$user.phoneNumber',
        bookingCount: 1
      }
    }
  ]);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: topUsers
  });
};

const getTopFields = catchAsync(async (req, res) => {
  const topFields = await OrderFieldModel.aggregate([
    {
      $match: {
        statusBooking: { $in: ['confirmed', 'completed'] }
      }
    },
    {
      $group: {
        _id: "$fieldId",
        bookingCount: { $sum: 1 },
        branchId: { $first: "$branchId" } // lấy branchId từ đơn đặt
      }
    },
    { $sort: { bookingCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'fields',
        localField: '_id',
        foreignField: '_id',
        as: 'field'
      }
    },
    { $unwind: '$field' },
    {
      $lookup: {
        from: 'branchs',
        localField: 'branchId',
        foreignField: '_id',
        as: 'branch'
      }
    },
    { $unwind: '$branch' },
    {
      $project: {
        _id: 0,
        fieldId: '$field._id',
        fieldName: '$field.name',
        bookingCount: 1,
        branchName: '$branch.name',
        branchImages:'$branch.images'
      }
    }
  ]);

  return res.status(StatusCodes.OK).json({
    success: true,
    data: topFields
  });
})

const getNewUsersStatistic = catchAsync(async (req, res) => {
  const now = new Date();
  const month = parseInt(req.query.month) || now.getMonth() + 1; // getMonth: 0-based
  const year = parseInt(req.query.year) || now.getFullYear();

  // Tính khoảng thời gian đầu tháng và cuối tháng
  const startDate = new Date(year, month - 1, 1); // JS tháng bắt đầu từ 0
  const endDate = new Date(year, month, 0, 23, 59, 59, 999); // cuối tháng

  const newUsersCount = await UserModel.countDocuments({
    createdAt: {
      $gte: startDate,
      $lte: endDate,
    }
  });

  return res.status(StatusCodes.OK).json({
    success: true,
    data: {
      month,
      year,
      newUsers: newUsersCount
    }
  });
});

export default {
  getMonthlyRevenue,
  getSuccessBookings,
  getTopUsers,
  getPendingBookings,
  getTopFields,
  getNewUsersStatistic
}