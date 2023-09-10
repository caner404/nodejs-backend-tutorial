import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { router as tourRouter } from './routes/tourRoutes';
import { router as userRouter } from './routes/userRoutes';
import AppError from './utils/appError';
import { globalErrHandler } from './controllers/errorController';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';
import ExpressMongoSanitize = require('express-mongo-sanitize');
import hpp from 'hpp';

dotenv.config();

export const app: Express = express();
//1. GLOBALMidldewares
//Middlware order in code is important .defines execution order -> needs be to always before othes routes
app.use(helmet());
app.use(express.json());

//Data sanitization against NoSQL query injection
app.use(ExpressMongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Rate Limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000, //1h
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// 3) Routers mouting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrHandler);

//index.js mainly used for connecting our different middlewares
