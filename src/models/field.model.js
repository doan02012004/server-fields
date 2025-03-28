import mongoose from "mongoose";


const fieldSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        trim: true
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'branchs'
    },
    typeFields:[
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'typeFields'
        }
    ],
    images: [
        {
            type: String,
            required: true
        }
    ],
    rangeTimes:[
        {
            text:{
                type: String,
                required: true
            },
            startTime:{
                type:Number,
                required:true
            },
            endTime:{
                type:Number,
                required:true
            }
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