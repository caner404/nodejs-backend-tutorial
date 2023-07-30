import express, { Express, NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { router as tourRouter } from './routes/tourRoutes';
import { router as userRouter } from './routes/userRoutes';

dotenv.config();

export const app: Express = express();
//1. Midldewares
//Middlware order in code is important .defines execution order -> needs be to always before othes routes
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log('Hello from the middleware :D');
  next();
});

// 3) Routers mouting
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//index.js mainly used for connecting our different middlewares
