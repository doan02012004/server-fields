import express from 'express'
import uploadController from '../../controllers/upload.controller.js';
import upload from '../../configs/multer.config.js';
const router = express.Router();

router.post('/upload',upload.single('image'),uploadController.uploadFileController)

export default router