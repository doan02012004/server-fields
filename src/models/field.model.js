import mongoose from "mongoose";


const fieldSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    brandId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'branchs'
    },
    images: [
        {
            type: String,
            required: true
        }
    ],
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Boolean,
        default: true
    },
    size:{
        width:{
            type:Number,
            required:true
        },
        length:{
            type:Number,
            required:true
        },
    },
    rate: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
})

const FieldModel = mongoose.model('fields', fieldSchema)

export default FieldModel