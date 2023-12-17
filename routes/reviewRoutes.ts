import express from 'express';
import { getAllReviews, createReview } from '../controllers/reviewController';
import * as authController from '../controllers/authController';

// each router only has access to his own params
//set mergeParams true so we can access the tourId from the parent router.

// POST /tour/1234/reviews
// GET  /tour/1234/reviews
// GET /tour/1234/reviews/4321

export const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protect, authController.restrictTo('user'), getAllReviews)
  .post(createReview);
