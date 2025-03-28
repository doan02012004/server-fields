import mongoose from "mongoose";

const typeFieldSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    playerNumber: {
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

const TypeFieldModel = mongoose.model('type_fields', typeFieldSchema)

export default TypeFieldModel