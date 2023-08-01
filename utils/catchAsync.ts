import { NextFunction, Request, Response } from 'express';

//return anoymous function so express doenst call our middleware handler directly
const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
