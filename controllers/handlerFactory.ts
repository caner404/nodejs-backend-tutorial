import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import APIFeatures from '../utils/apiFeatures';

const factory = {
  getAll: (Model: any) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      //Too allow for nested GET reviews on tour
      let filter = {};
      if (req.params.tourId) filter = { tour: req.params.tourId };
      const features = new APIFeatures(Model.find(filter), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
      //Execute Query
      const docs: [] = await features.query;

      res.status(200).json({
        status: 'success',
        results: docs.length,
        data: {
          docs,
        },
      });
    }),
  getOne: (Model: any, popOptions: any = null) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      let query = Model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);
      const doc = await query; // find all guides with the corresponding ObjectId

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    }),
  deleteOne: (Model: any) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(new AppError('No document found with that ID', 404));
      }

      res.status(204).json({
        status: 'success',
        data: null,
      });
    }),
  updateOne: (Model: any) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true, //returns the updated tour
        runValidators: true,
      });

      if (!document) {
        return next(new AppError('No document updated with that ID', 404));
      }
      res.status(200).json({
        status: 'success',
        data: {
          data: document,
        },
      });
    }),
  createOne: (Model: any) =>
    catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const document = await Model.create(req.body);
      res.status(201).json({
        status: 'success',
        data: {
          data: document,
        },
      });
    }),
};

export default factory;
