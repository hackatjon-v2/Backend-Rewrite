import { NextFunction, Request, Response } from "express";

export const activeRequests: Set<Response> = new Set();

export const trackRequests = (
  _: Request,
  res: Response,
  next: NextFunction
) => {
  activeRequests.add(res);

  res.on("finish", () => {
    activeRequests.delete(res);
  });

  next();
};
