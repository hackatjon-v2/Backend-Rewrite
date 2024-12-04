import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";

// Custom error handling middleware
const errorHandler = (
  err: any,
  _: Request,
  res: Response,
  __: NextFunction
) => {
  if (err instanceof Error.CastError || err instanceof Error.ValidationError) {
    return res.status(400);
  }

  return res.status(500);
};

export default errorHandler;
