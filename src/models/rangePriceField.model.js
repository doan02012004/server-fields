import mongoose from "mongoose";


const rangePriceFieldSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    fieldId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'fields'
    },
    startDayInWeek: {
        type: Number,
        required: true
    },
    endDayInWeek: {
        type: Number,
        required: true
    },
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
    price: {
        type: Number,
        required: true
    },
    deletedAt:{
        type: Date,
        default:null
    }
}, {
    timestamps: true,
    versionKey: false
})

const RangePriceFieldModel = mongoose.model('range_price_fields', rangePriceFieldSchema)

export default RangePriceFieldModel