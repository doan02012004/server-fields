import express from 'express'
import typeFieldController from '../../controllers/typeField.controller.js';

const typeFieldRoute = express.Router();

typeFieldRoute.post('/',typeFieldController.createTypeFieldController)
typeFieldRoute.get('/',typeFieldController.getAllTypeFieldController)
// typeFieldRoute.get('/details/:id')
// typeFieldRoute.put('/update/:id')

export default typeFieldRoute