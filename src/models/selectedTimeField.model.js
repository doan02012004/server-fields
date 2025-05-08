import mongoose from "mongoose";

const selectedTimeFieldSchema = new mongoose.Schema({
    fieldId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fields",
        required: true
    },
    selectedTimeBranchId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "selected_time_branchs",
        required: true
    },
    disable: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
}, {
    timestamps: true
});

const SelectedTimeFieldModel = mongoose.model("selected_time_fields", selectedTimeFieldSchema);

export default SelectedTimeFieldModel