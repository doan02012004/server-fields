import express from 'express'
import commentFieldController from '../../controllers/commentField.controller.js';
import checkAuth from '../../middlewares/auth.middleware.js';

const commentFieldRoute = express.Router();
 commentFieldRoute.get('/web/:branchId',commentFieldController.getCommentsByBranchIdController)
 commentFieldRoute.post('/create',checkAuth, commentFieldController.createCommentFieldController)
 commentFieldRoute.put('/toggle-like/:commentId',checkAuth, commentFieldController.toggleLikeCommentController)

export default commentFieldRoute