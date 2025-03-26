import mongoose from "mongoose";

const typePlayerNumberSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    playerNumber: {
        type: Number,
        required: true
    },
}, {
    timestamps: true,
    versionKey: false
})

const TypePlayerNumberModel = mongoose.model('type_player_numbers', typePlayerNumberSchema)

export default TypePlayerNumberModel