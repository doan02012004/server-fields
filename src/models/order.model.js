import mongoose from "mongoose";

const orderFieldSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'branchs'
    },
    fieldId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'fields'
    },
    timeId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'selected_time_branchs'
    },
    orderCode:{
        type:String,
        required:true,
        unique:true
    },
    paymentMethod:{
        type:String,
        required:true,
        enum:['zalopay','vnpay']
    },
    dayBookings: [{ type: Date }],
    dayNumber:{
        type:Number,
        required:true
    },
    priceDeposit:{
        type:Number,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    },
    paymentDate:{
        type: Date,
        default: null
    },
    statusBooking: {
        type:String,
        enum:['unpaid','pending','confirmed','completed','canceled','refund','refunded'],
        default:'unpaid'
    },
    isRating: {
        type:Boolean,
        default:false
    }
}, {
    timestamps: true,
    versionKey: false
})

const OrderFieldModel = mongoose.model('order_fields', orderFieldSchema)

export default OrderFieldModel