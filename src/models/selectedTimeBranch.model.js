import mongoose from "mongoose";

const selectedTimeBranchSchema = new mongoose.Schema({
    branchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "branchs",
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
    text:{
        type: String,
        required: true
    },
    deletedAt: {
        type: Date,
        default: null
    },
}, {
    timestamps: true
});

const SelectedTimeBranchModel = mongoose.model("selected_time_branchs", selectedTimeBranchSchema);

export default SelectedTimeBranchModel