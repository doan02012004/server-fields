import express from 'express'
import authController from '../../controllers/auth.controller.js';
import checkAuth from '../../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/login',authController.loginController)
router.post('/register', authController.registerController);
router.post('/logout', authController.logoutController);
router.post('/refresh-tokens', authController.requestRefreshToken);
router.put('/change-password/:userId',checkAuth,authController.changePasswordController)
export default router