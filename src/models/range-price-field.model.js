import mongoose from "mongoose";
const  rangePriceFieldSchemaItem = mongoose.Schema({
    from: {
        type: Number,
        required: true
    },
    to: {
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
}, {
    timestamps: true
})

const rangePriceFieldSchema = mongoose.Schema({
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
  
    startDay: {
        type: Number,
        required: true
    },
    endDay: {
        type: Number,
        required: true
    },
   
    items:[rangePriceFieldSchemaItem]
}, {
    timestamps: true,
    versionKey: false
})

const RangePriceFieldModel = mongoose.model('range_price_fields', rangePriceFieldSchema)

export default RangePriceFieldModel