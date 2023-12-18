import { NextFunction, Request, Response } from 'express';
import { Review } from '../models/reviewModel';
import factory from './handlerFactory';

export const setTourAndUserIds = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user._id;
  next();
};

export const getAllReviews = factory.getAll(Review);
export const getReview = factory.getOne(Review);
export const createReview = factory.createOne(Review);
export const deleteReview = factory.deleteOne(Review);
export const updateReview = factory.updateOne(Review);
