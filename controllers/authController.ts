import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/userModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';

interface JWTUserPayload {
  id: string;
  iat: number;
  exp: number;
}

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
      passwordChangedAt: req.body.passwordChangedAt,
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
      return res.status(400).json({
        status: 'error',
        message: 'Please provide email and password',
      });
    }

    // 2) Check if the user exit && password is correct
    const user = await User.findOne({ email: email }).select('+password'); //normally password field not included in select,explicity select password
    const correct = await user?.correctPassword(
      password,
      user.password.toString()
    );

    if (!user || !correct) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect credentials (email or password)',
      });
    }

    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token,
    });
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (
      !req.headers.authorization ||
      !req.headers.authorization?.startsWith('Bearer') ||
      req.headers.authorization.split(' ').length <= 1
    ) {
      return next(
        new AppError('You are not logged in. Please log in to get access', 401)
      );
    }
    const token = req.headers.authorization.split(' ')[1];
    // 2) Verify token
    const decoced: JWTUserPayload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JWTUserPayload;
    console.log(decoced);

    // 3) Check if user still exists
    const user = await User.findById(decoced.id);
    if (!user) {
      return next(
        new AppError(
          'The user belonging to the token does no longer exist',
          401
        )
      );
    }

    // 4) Check if user changed password after the token was issued
    if (user.changedPasswordAfter(decoced.iat)) {
      return next(
        new AppError(
          'The User recently changed password! Please log in again',
          401
        )
      );
    }
    next();
  }
);
