import cookieParser from "cookie-parser"; // Middleware for parsing cookies
import cors from "cors"; // Middleware for enabling Cross-Origin Resource Sharing (CORS)
import type { Request, Response } from "express"; // Types for Express request and response objects
import express from "express"; // Express framework
import setRateLimit from "express-rate-limit"; // Middleware for setting up rate limiting
import multer from "multer"; // Middleware for handling file uploads
import { PORT } from "../env"; // Importing the server port from environment configuration
import { Log } from "../logging"; // Logging utility
import { Method } from "../types/api"; // Enum for HTTP methods
import { RouteStore, RouteType } from "../types/route"; // Types for defining routes
import { corsOptions } from "./cors"; // CORS options configuration
import errorHandler from "./error"; // Custom error-handling middleware
import { Routes } from "./stores"; // Centralized store of defined routes
import { trackRequests } from "./tracker"; // Middleware for tracking requests

/**
 * List of assigned routes to avoid duplicate registration.
 * @type {string[]}
 */
export const Assigned: string[] = [];

/**
 * Express application instance.
 * @type {import('express').Express}
 */
export let App = express();

/**
 * Middleware configuration for the Express application.
 */
App.use(
  multer().none(), // Parse non-file multipart form data
  express.json(), // Parse incoming JSON payloads
  cors(corsOptions), // Enable CORS with pre-configured options
  errorHandler, // Custom error handler
  cookieParser(), // Parse cookies
  trackRequests // Track requests for monitoring/logging
);

/**
 * Starts the Express server and assigns routes.
 */
export function StartServer() {
  Log(`Starting Express API on port ${PORT}...`, `START`);

  App.options("*", cors(corsOptions)); // Enable CORS preflight for all routes
  App.set("trust proxy", true); // Enable trust proxy for rate limiting and IP tracking

  App.listen(PORT, () => {
    assignRoutes(Routes()); // Dynamically assign all registered routes
    Log(`Express API started! We're good to go.`, `START`);
  });
}

/**
 * Assigns a single route to the Express application.
 *
 * @param {RouteType} route - The route configuration object.
 * @returns {boolean} - Whether the route was successfully assigned.
 */
export function assignRoute(route: RouteType): boolean {
  const fun = MethodTranslations()[route.method]; // Get the Express method (e.g., App.get, App.post)
  const identifier = `${route.path}@${route.method}`; // Unique identifier for the route

  // Skip if the method is invalid or the route is already assigned
  if (!fun || Assigned.includes(identifier)) return false;

  Assigned.push(identifier); // Mark the route as assigned

  // Set up rate limiting for the route
  const maxReq = route.maxRequests || 1000;
  const rateLimit = setRateLimit({
    windowMs: 60 * 1000 * 10, // 10-minute window
    max: maxReq, // Maximum requests allowed
    message: `You've been rate limited! This endpoint only allows ${maxReq} calls per 10min`,
    headers: true,
    validate: { trustProxy: false }, // Disable trusting proxy headers for client IPs
  });

  // Register the route handler
  fun(route.path, rateLimit, (req: Request, res: Response) => {
    const stop = (c = 400) => {
      res.status(c); // Set the HTTP status code
      res.end(); // End the response
      return ""; // Return an empty string to satisfy the callback
    };

    Log(
      `Incoming ${route.method.toUpperCase()} ${route.path}`,
      "API",
      req.ip || "<anonymous>" // Log the request method, path, and client IP
    );

    try {
      route.callback(req, res, stop); // Execute the route's callback
    } catch {
      stop(500); // Respond with 500 Internal Server Error on exception
    }

    return;
  });

  Log(
    `Loaded API endpoint ${route.path} on method ${route.method.toUpperCase()}` // Log successful route assignment
  );

  return true;
}

/**
 * Assigns multiple routes from one or more route stores to the Express application.
 *
 * @param {...RouteStore[]} stores - List of route stores to process.
 */
export function assignRoutes(...stores: RouteStore[]) {
  for (const store of stores) {
    for (const [method, path, callback, maxRequests] of store) {
      const created = assignRoute({ method, path, callback, maxRequests });

      if (!created)
        Log(`failed to assign ${method} -> ${path}`, `API`, `Warning`); // Log warnings for failed assignments
    }
  }
}

/**
 * Provides a mapping of HTTP methods to their corresponding Express application methods.
 *
 * @returns {Record<Method, (...args: any[]) => any>} - Object mapping HTTP methods to Express methods.
 */
export function MethodTranslations(): Record<Method, (...args: any[]) => any> {
  return {
    get: App.get.bind(App), // Map 'get' to App.get
    post: App.post.bind(App), // Map 'post' to App.post
    options: App.options.bind(App), // Map 'options' to App.options
    delete: App.delete.bind(App), // Map 'delete' to App.delete
    put: App.put.bind(App), // Map 'put' to App.put
    all: App.all.bind(App), // Map 'all' to App.all
    patch: App.patch.bind(App), // Map 'patch' to App.patch
    head: App.head.bind(App), // Map 'head' to App.head
  };
}
