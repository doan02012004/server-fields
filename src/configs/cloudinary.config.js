import { v2 as cloudinary } from 'cloudinary';
import { config } from './app.config.js';


cloudinary.config({
  cloud_name:config.CLOUDINARY_CLOUD_NAME, // Lấy từ Cloudinary dashboard
  api_key: config.CLOUDINARY_API_KEY,       // Lấy từ Cloudinary dashboard
  api_secret:config.CLOUDINARY_API_SECRET, // Lấy từ Cloudinary dashboard
});

export default cloudinary;