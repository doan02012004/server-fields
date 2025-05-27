import mongoose from "mongoose";


const commentFieldSchema = mongoose.Schema({
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
    orderFieldId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'order_fields'
    },
    rating: {
        type: Number,
        default: 0
    },
    content: {
        type: String,
        required: true
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'users'
        }
    ],
    isPublic: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    versionKey: false
})

const CommentFieldModel = mongoose.model('comment_fields', commentFieldSchema)

export default CommentFieldModel