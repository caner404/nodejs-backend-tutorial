import express from 'express';
import {
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
  alliasTopTours,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tourController';
import * as authController from '../controllers/authController';
import { router as reviewRotuer } from './reviewRoutes';

export const router = express.Router();

router.use('/:tourId/reviews', reviewRotuer);

router.route('/top5-cheap').get(alliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(authController.protect, getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    deleteTour
  );
