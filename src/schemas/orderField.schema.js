import Joi from "joi"

const checkInfoBookingSchema = Joi.object({
    date: Joi.date().min('now').required(),
    dayNumber:Joi.number().min(0).max(6).required(),
    fieldId:Joi.string().required().trim(),
   timeId:Joi.string().required().trim(),
})

const orderFieldSchema = Joi.object({
    userId: Joi.string().required().trim(),
    branchId: Joi.string().required().trim(),
    fieldId: Joi.string().required().trim(),
    timeId:Joi.string().required().trim(),
    dayBookings: Joi.array().items(Joi.date()).required(),
    dayNumber: Joi.number().min(0).max(6).required(),
    priceDeposit: Joi.number().min(0).required(),
    totalPrice: Joi.number().min(0).required(),
    statusBooking: Joi.string().valid('pending','confirmed','canceled','deposited','refund','refunded').default('pending'),
    paymentMethod: Joi.string().valid('zalopay','vnpay').required(),
})

export default {
    checkInfoBookingSchema,
    orderFieldSchema
}