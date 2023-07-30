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

export const router = express.Router();

router.route('/top5-cheap').get(alliasTopTours, getAllTours);
router.route('/tour-stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
