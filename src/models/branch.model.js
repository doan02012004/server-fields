import mongoose from "mongoose";


const branchSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug:{
        type: String,
        required: true,
        trim: true
    },
    address_text: {
        type: String,
        required: true,
        trim: true
    },
    images:[
        {
            type:String,
            required: true
        }
    ],
    diagramImage:{
        type:String,
        required: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    ward: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    status: {
        type: Boolean,
        default: true
    },
    timeActive: {
        startTime: {
            type: Number,
            required: true
        },
        endTime: {
            type: Number,
            required: true
        },
        title: {
            type: String,
            required: true,
            trim: true
        },
    },
    rate:{
        type:Number,
        default:0
    }
}, {
    timestamps: true,
    versionKey: false
})

const BranchModel = mongoose.model('branchs', branchSchema)

export default BranchModel