import { NextFunction, Request, Response } from 'express';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { User } from '../models/userModel';
import factory from './handlerFactory';

function filterRequestBody(
  reqBody: Record<string, any>,
  ...filterKeys: string[]
): Record<string, any> {
  const filteredRequestBody: Record<string, any> = {};
  for (const key in reqBody) {
    if (filterKeys.includes(key)) {
      filteredRequestBody[key] = reqBody[key];
    }
  }
  return filteredRequestBody;
}

export const getAllUsers = factory.getAll(User);
export const deleteUser = factory.deleteOne(User);
export const getUser = factory.getOne(User);
export const updateUser = factory.updateOne(User);

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};

export const updateCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'This route is not for password updates. Please use /updateMyPassword.',
          400
        )
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterRequestBody(req.body, 'name', 'email');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }
);

export const deleteCurrentUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);
