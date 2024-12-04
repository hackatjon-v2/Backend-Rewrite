import gatherEndpoints from "../../gatherEndpoints"; // Importing a utility function to gather route information
import { RouteArrayed } from "../../types/route"; // Importing the RouteArrayed type for route definition
import Auth from "../../verifyToken"; // Importing the Auth class for API key validation

/**
 * @module GatherEndpoints
 * @description This module defines a route for retrieving all available endpoints in the application.
 */

export const GatherEndpoints: RouteArrayed = [
  "get", // HTTP method
  "/routes", // Route endpoint
  /**
   * Route handler for "/routes".
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object used to send the response.
   * @param {Function} stop - A utility function to terminate the request early with a specific status code.
   */
  (req, res, stop) => {
    const auth = new Auth(process.env.API_KEY); // Instantiate the Auth class with the API key from environment variables

    // Check if the 'Authorization' header is present
    if (!req.headers.authorization) return stop(401); // Stop the request with a 401 Unauthorized status

    // Validate the API key using the Auth class
    if (!auth.validateApiKey(req)) {
      return stop(403); // Stop the request with a 403 Forbidden status if validation fails
    }

    res.json(gatherEndpoints()); // Respond with the output of gatherEndpoints() as JSON
    return; // Explicitly return to end the function
  },
  0, // Priority (used in the route array structure for determining order or importance)
];
