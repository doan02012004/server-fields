import Joi from "joi"

const branchSchema = Joi.object({
    name: Joi.string().required().trim().min(3),
    slug:Joi.string().required().trim(),
    address_text:Joi.string().required().trim(),
    images: Joi.array().items(Joi.string().required()),
    diagramImage:Joi.string().required().trim(),
    city: Joi.string().required().trim(),
    district: Joi.string().required().trim(),
    ward: Joi.string().required().trim(),
    description:Joi.string().required().trim(),
    phoneNumber: Joi.string().required().trim(),
    status: Joi.boolean().optional(),
    timeActive:Joi.object( {
        startTime: Joi.number().min(0).max(1440),
        endTime:  Joi.number().min(0).max(1440),
        title:Joi.string().required().trim(),
    }),
    selectTimes: Joi.array().items(Joi.object({
         _id: Joi.string().optional(),
        text:Joi.string().required(),
        startTime:Joi.number().required(),
        endTime:Joi.number().required(),
        branchId:Joi.string().min(0).optional(),
        disabled:Joi.boolean().optional(),
    })),
    rate: Joi.number().optional(),
    status:Joi.boolean()
})


export default {
    branchSchema
}