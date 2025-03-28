import Joi from "joi"


const typeFieldSchema = Joi.object({
    name:Joi.string().min(0).required().trim(),
    playerNumber:Joi.number().min(0).required(),
})


export default {
    typeFieldSchema
}