import express from 'express'
import authRoute from './auth.route.js'
import userRoute from './user.route.js'
import uploadRoute from './upload.route.js'
import branchRoute from './branch.route.js'

const router = express.Router();

const defaultRoutes = [
 {
    path:'/auth',
    route:authRoute
 },
 {
    path:'/users',
    route:userRoute
 },
 {
    path:'/branchs',
    route:branchRoute
 },
 {
    path:'/images',
    route:uploadRoute
 },
];


defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});



export default router;
