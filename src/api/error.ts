import { NextFunction, Request, Response } from "express";

// Custom error handling middleware
const errorHandler = (
  ___: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
 
  return res.status(500);
};

export default errorHandler;
