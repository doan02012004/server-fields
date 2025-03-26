import Joi from 'joi'
const registerSchema = Joi.object({
    name:Joi.string().required().min(3).max(30),
    email: Joi.string().required().email(),
    password:Joi.string().required().min(3).max(30),
    phoneNumber:Joi.string().required().min(1),
})

const loginSchema = Joi.object({
    email: Joi.string().required().email(),
    password:Joi.string().required().min(3).max(30),
})

export default {
    registerSchema,
    loginSchema
}