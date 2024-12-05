import { Database } from "../../../database/database";
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
  async (req, res, stop) => {
    const { token } = req.body;

    if (!token) {
      return stop(401); // Stop the request with a 401 Unauthorized status
    }

    // Check if the token is valid
    const database = new Database(); // Initialize the database connection

    try {
      database.connect(); // Attempt to connect to the database
    } catch (error) {
      return stop(500); // Stop the request with a 500 Internal Server Error status
    }

    // Fetch the token from the database
    const fetchToken = (await database.query("SELECT * FROM sessions WHERE token = ?", [token])) as { id: number; token: string }[];

    // Check if the token exists
    if (fetchToken.length === 0) {
      return stop(401); // Stop the request with a 401 Unauthorized status
    }

    res.json(LOG); // Respond with the contents of the LOG object in JSON format
    return;
  },
  0, // Priority (used in the route array structure for determining order or importance)
];
