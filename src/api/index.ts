import cookieParser from "cookie-parser";
import cors from "cors";
import type { Request, Response } from "express";
import express from "express";
import setRateLimit from "express-rate-limit";
import multer from "multer";
import { PORT } from "../env";
import { Log } from "../logging";
import { Method } from "../types/api";
import { RouteStore, RouteType } from "../types/route";
import { corsOptions } from "./cors";
import errorHandler from "./error";
import { Routes } from "./stores";
import { trackRequests } from "./tracker";

export const Assigned: string[] = [];
export let App = express();

App.use(
  multer().none(),
  express.json(),
  cors(corsOptions),
  errorHandler,
  cookieParser(),
  trackRequests
);

export function StartServer() {
  Log(`Starting Express API on port ${PORT}...`, `START`);

  App.options("*", cors(corsOptions));
  App.set("trust proxy", true);

  App.listen(PORT, () => {
    assignRoutes(Routes());

    Log(`Express API started! We're good to go.`, `START`);
  });
}

export function assignRoute(route: RouteType) {
  const fun = MethodTranslations()[route.method];
  const identifier = `${route.path}@${route.method}`;

  if (!fun || Assigned.includes(identifier)) return false;

  Assigned.push(identifier);

  const maxReq = route.maxRequests || 1000;
  const rateLimit = setRateLimit({
    windowMs: 60 * 1000 * 10,
    max: maxReq,
    message: `You've been rate limited! This endpoint only allows ${maxReq} calls per 10min`,
    headers: true,
    validate: { trustProxy: false },
  });

  fun(route.path, rateLimit, (req: Request, res: Response) => {
    const stop = (c = 400) => {
      res.status(c);
      res.end();

      return "";
    };

    Log(
      `Incoming ${route.method.toUpperCase()} ${route.path}`,
      "API",
      req.ip || "<anonymous>"
    );

    try {
      route.callback(req, res, stop);
    } catch {
      stop(500);
    }

    return;
  });

  Log(
    `Loaded API endpoint ${route.path} on method ${route.method.toUpperCase()}`
  );

  return true;
}

export function assignRoutes(...stores: RouteStore[]) {
  for (const store of stores) {
    for (const [method, path, callback, maxRequests] of store) {
      const created = assignRoute({ method, path, callback, maxRequests });

      if (!created)
        Log(`failed to assign ${method} -> ${path}`, `API`, `Warning`);
    }
  }
}

export function MethodTranslations(): Record<Method, (...args: any[]) => any> {
  return {
    get: App.get.bind(App),
    post: App.post.bind(App),
    options: App.options.bind(App),
    delete: App.delete.bind(App),
    put: App.put.bind(App),
    all: App.all.bind(App),
    patch: App.patch.bind(App),
    head: App.head.bind(App),
  };
}
