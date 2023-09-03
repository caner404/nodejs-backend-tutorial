import 'express-async-errors';
import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { router as tourRouter } from './routes/tourRoutes';
import { router as userRouter } from './routes/userRoutes';
import AppError from './utils/appError';
import { globalErrHandler } from './controllers/errorController';
import { User } from './models/userModel';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

dotenv.config();

export const app: Express = express();
//1. Midldewares
//Middlware order in code is important .defines execution order -> needs be to always before othes routes
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 3) Routers mouting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrHandler);

//index.js mainly used for connecting our different middlewares
