import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import cloudinary from "./cloudinary.config.js";

// Cấu hình storage cho Multer sử dụng Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'project',          // Thư mục Cloudinary để lưu ảnh
        allowed_formats: ['jpg', 'png', 'jpeg'], // Các định dạng ảnh cho phép
      },
  });
  
  const upload = multer({ storage });
  
  export default upload;