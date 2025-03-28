import express from 'express'
import authRoute from './auth.route.js'
import userRoute from './user.route.js'
import uploadRoute from './upload.route.js'
import branchRoute from './branch.route.js'
import fieldRoute from './field.route.js'
import typeFieldRoute from './typeField.route.js'

const router = express.Router();

const defaultRoutes = [
   {
      path: '/auth',
      route: authRoute
   },
   {
      path: '/users',
      route: userRoute
   },
   {
      path: '/branchs',
      route: branchRoute
   },
   {
      path: '/images',
      route: uploadRoute
   },
   {
      path: '/fields',
      route: fieldRoute
   },
   {
      path: '/type-fields',
      route: typeFieldRoute
   },
];


defaultRoutes.forEach((route) => {
   router.use(route.path, route.route);
});



export default router;
