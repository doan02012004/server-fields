import express from 'express'
import branchController from '../../controllers/branch.controller.js';
import checkAuth from '../../middlewares/auth.middleware.js';
import checkAdmin from '../../middlewares/admin.middleware.js';

const router = express.Router();

router.post('/',branchController.createBranchController)
router.get('/',branchController.getAllBranchController)
router.get('/details/:id',branchController.getBranchByIdController)
router.put('/update/:id',branchController.updateBranchController)
export default router