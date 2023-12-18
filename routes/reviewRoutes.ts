import express from 'express';
import * as authController from '../controllers/authController';
import {
  createReview,
  deleteReview,
  getAllReviews,
  getReview,
  setTourAndUserIds,
  updateReview,
} from '../controllers/reviewController';

// each router only has access to his own params
//set mergeParams true so we can access the tourId from the parent router.

// POST /tour/1234/reviews
// GET  /tour/1234/reviews
// GET /tour/1234/reviews/4321

export const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    setTourAndUserIds,
    createReview
  );

router.route('/:id').delete(deleteReview).patch(updateReview).get(getReview);
