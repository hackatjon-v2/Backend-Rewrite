import type { Request, Response } from "express";
import { Method } from "./api";

export interface RouteType {
  method: Method;
  path: string;
  callback: RouteCallback;
  maxRequests?: number;
}

export type RouteArrayed = [Method, string, RouteCallback, number];
export type RouteStore = RouteArrayed[];

export type RouteCallback = (
  req: Request,
  res: Response,
  stop: (c?: number) => string
) => void;
