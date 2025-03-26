import mongoose from "mongoose";

const imageSchema = new mongoose.Schema({
  image_url: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  isUsed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const ImageModel = mongoose.model("images", imageSchema);

export default ImageModel