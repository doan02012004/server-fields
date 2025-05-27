import express from 'express'
import authRoute from './auth.route.js'
import userRoute from './user.route.js'
import uploadRoute from './upload.route.js'
import branchRoute from './branch.route.js'
import fieldRoute from './field.route.js'
import orderFieldRoute from './orderField.route.js'
import statisticsRoute from './statistics.route.js'
import commentFieldRoute from './commentField.route.js'

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
      path: '/order-field',
      route: orderFieldRoute
   },
   {
      path: '/statistics',
      route: statisticsRoute
   },
    {
      path: '/comment-fields',
      route: commentFieldRoute
   },
];


defaultRoutes.forEach((route) => {
   router.use(route.path, route.route);
});



export default router;
