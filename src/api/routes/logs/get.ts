import { LOG } from "../../../logging"; // Importing the LOG object from the logging module
import { RouteArrayed } from "../../../types/route"; // Importing the RouteArrayed type for proper typing

/**
 * @module Logs
 * @description This module defines a route for fetching server logs.
 */

export const Logs: RouteArrayed = [
  "get", // HTTP method
  "/logs", // Route endpoint
  /**
   * Route handler for "/logs".
   *
   * @param {Object} _ - The unused HTTP request object (placeholder for the first parameter).
   * @param {Object} res - The HTTP response object used to send the response.
   */
  (_, res) => {
    res.json(LOG); // Respond with the contents of the LOG object in JSON format
  },
  0, // Priority (used in the route array structure for determining order or importance)
];
