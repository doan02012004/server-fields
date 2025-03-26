import express from 'express'
import checkAuth from '../../middlewares/auth.middleware.js';
import userController from '../../controllers/user.controller.js';
const router = express.Router();

router.get('/me',checkAuth, userController.getMeController)

export default router