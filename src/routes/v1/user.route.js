import express from 'express'
import checkAuth from '../../middlewares/auth.middleware.js';
import userController from '../../controllers/user.controller.js';
const router = express.Router();

router.get('/me',checkAuth, userController.getMeController)
router.get('/', userController.getAllUserController )
router.get('/detail/:userId', userController.getUserByIdController )
router.put('/update/:userId',userController.updateUserByIdController)
router.delete('/remove/:userId',userController.removeUserByIdController)
export default router