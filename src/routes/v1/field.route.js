import express from 'express'
import fieldController from '../../controllers/field.controller.js';

const fieldRoute = express.Router();

fieldRoute.post('/',fieldController.createFieldController)
fieldRoute.get('/',fieldController.getAllFieldController)
fieldRoute.get('/details/:id',fieldController.getFieldByIdController)
fieldRoute.put('/update/:id',fieldController.UpdateFieldByIdController)
export default fieldRoute