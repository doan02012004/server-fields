import Joi from 'joi'
const registerSchema = Joi.object({
    name: Joi.string().trim().required(),

    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .required(),

    password: Joi.string().trim().required(),
    
    confirmPassword: Joi.string()
    .trim()
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Mật khẩu xác nhận không khớp với mật khẩu',
    }),

    phoneNumber: Joi.string().required(),

    gender: Joi.string()
        .valid('male', 'female')
        .required(),

    dateOfBirth: Joi.date().required(),
})

const loginSchema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().trim().required().min(3).max(30),
})

export default {
    registerSchema,
    loginSchema
}