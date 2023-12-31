import * as crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/userModel';
import AppError from '../utils/appError';
import catchAsync from '../utils/catchAsync';
import { sendEmail } from '../utils/email';

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

const createSendToken = (user: any, statusCode: number, res: Response) => {
  const token = signToken(user.id);
  const cookieOption = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN!) * 24 * 60 * 60 * 1000 //convert to miliseconds -> 90days
    ),
    secure: false,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
  res.cookie('jwt', token, cookieOption);

  // Remove password from output
  user.password = undefined!;
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
    });

    createSendToken(newUser, 201, res);
  } catch (error) {
    next(error);
  }
};

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

    createSendToken(user, 200, res);
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
    req.user = user;
    next();
  }
);
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role.toString())) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new AppError('There is no user with that email address', 404)
      );
    }
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false }); //passwordConfirm not needed here

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: 'Token sent to email!',
      });
    } catch (err) {
      user.passwordResetToken = undefined!;
      user.passwordResetExpires = undefined!;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          'There was an error sending the email. Try again later!',
          500
        )
      );
    }
  }
);

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date(Date.now()) },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined!;
  user.passwordResetExpires = undefined!;
  await user.save();

  createSendToken(user, 200, res);
};

export const updatePassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user.id).select('+password');
    if (!user) {
      return next(new AppError('User was not found', 404));
    }
    if (
      !(await user.correctPassword(
        req.body.passwordCurrent,
        user.password.toString()
      ))
    ) {
      return next(new AppError('Password is not correct', 404));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createSendToken(user, 200, res);
  }
);
