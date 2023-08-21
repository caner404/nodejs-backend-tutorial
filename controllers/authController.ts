import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import { User } from '../models/userModel';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN!,
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //1.) Check if email and password exits
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if the user exit && password is correct
    const user = await User.findOne({ email: email }).select('+password'); //normally password field not included in select,explicity select password
    const correct = await user?.correctPassword(
      password,
      user.password.toString()
    );

    if (!user || !correct) {
      return next(
        new AppError('Incorrect credentials (email or password)', 401)
      );
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  }
);
