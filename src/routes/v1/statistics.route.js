import express from 'express'
import statisticsController from '../../controllers/statistics.controller.js';



const statisticsRoute = express.Router();
statisticsRoute.get('/revenue', statisticsController.getMonthlyRevenue);
statisticsRoute.get('/success-bookings', statisticsController.getSuccessBookings);
statisticsRoute.get('/pending-bookings', statisticsController.getPendingBookings);
statisticsRoute.get('/top-users', statisticsController.getTopUsers);
statisticsRoute.get('/top-fields', statisticsController.getTopFields);
statisticsRoute.get('/new-users', statisticsController.getNewUsersStatistic);


export default statisticsRoute