import express from 'express';
import { getAllReviews, createReview } from '../controllers/reviewController';
import * as authController from '../controllers/authController';
export const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('user'), getAllReviews)
  .post(createReview);
