import Joi from "joi"

const rangePrice = Joi.object({
    name: Joi.string().required().trim(),
    fieldId: Joi.string().optional(),
    dayInWeek: Joi.array().items(Joi.number()).min(1),
    startTime: Joi.number().min(0).max(1440).required(),
    endTime: Joi.number().min(0).max(1440).required(),
    title: Joi.string().min(1).required(),
    price: Joi.number().min(0).required(),
})

const fieldSchema = Joi.object({
    name: Joi.string().required().trim().min(3),
    slug: Joi.string().required().trim(),
    branchId: Joi.string().required().trim(),
    images: Joi.array().items(Joi.string().required()),
    description: Joi.string().required().trim(),
    status: Joi.boolean().optional(),
    size: Joi.object({
        width: Joi.number().min(0),
        length: Joi.number().min(0),
    }),
    rangeTimes: Joi.array().items(Joi.object({
        _id:z.string().optional(),
        text: Joi.string().required().trim().min(3),
        startTime: Joi.number().min(0).max(1440),
        endTime: Joi.number().min(0).max(1440),
    })),
    rate: Joi.number().optional(),
    rangePrices: Joi.array().items(rangePrice)
})


export default {
    fieldSchema
}