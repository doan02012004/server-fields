import express from 'express'
import orderFieldController from '../../controllers/orderField.controller.js';
import checkAuth from '../../middlewares/auth.middleware.js';


const orderFieldRoute = express.Router();


orderFieldRoute.get('/checkout',orderFieldController.getCheckoutOrderFieldController)
orderFieldRoute.post('/create-payment', orderFieldController.createPaymentOrderFieldController);
orderFieldRoute.get('/vnpay-return', orderFieldController.VnpayReturnController);
orderFieldRoute.post('/create-order', orderFieldController.createFieldOrderController);
orderFieldRoute.get('/vnpay-ipn', orderFieldController.createPaymentOrderFieldController);

// admin
orderFieldRoute.get('/admin', orderFieldController.GetOrderFieldAdminController);
orderFieldRoute.get('/admin/detail/:id', orderFieldController.GetOrderFieldByIdAdminController);
orderFieldRoute.put('/admin/update-status/:id', orderFieldController.UpdateStatusOrderFieldAdminController);

// web
orderFieldRoute.get('/web/detail/:orderCode', orderFieldController.GetOrderFieldByOrderCodeController);
orderFieldRoute.get('/web',checkAuth, orderFieldController.GetAllOrderFieldByUserIdController);
orderFieldRoute.put('/web/update-status/:id', checkAuth, orderFieldController.UpdateStatusOrderFieldController);

export default orderFieldRoute