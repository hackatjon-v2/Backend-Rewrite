import { verify } from "argon2";
import { Database } from "../../../database/database";
import { RouteArrayed } from "../../../types/route";
import { User } from "../../../types/user";
import Auth from "../../../verifyToken";
import { generateToken } from "../../../token";

/**
 * @module UserGet
 * @description This module defines a route for fetching all users.
 */

export const UserGet: RouteArrayed = [
  "post", // HTTP method
  "/user", // Route endpoint
  /**
   * Route handler for "/logs".
   *
   * @param {Object} _ - The unused HTTP request object (placeholder for the first parameter).
   * @param {Object} res - The HTTP response object used to send the response.
   */
  async (req, res, stop) => {
    const auth = new Auth(process.env.API_KEY); // Instantiate the Auth class with the API key from environment variables

    // Check if the 'Authorization' header is present
    if (!req.headers.authorization) return stop(401); // Stop the request with a 401 Unauthorized status

    // Validate the API key using the Auth class
    if (!auth.validateApiKey(req)) {
      return stop(403); // Stop the request with a 403 Forbidden status if validation fails
    }

    const { username, password, email } = req.body;

    if (!password || (!username && !email)) {
      return stop(400);
    }

    const database = new Database(); // Instantiate the database object
    try {
      database.connect();
    } catch (error) {
      return stop(500); // Internal Server Error
    }

    // Define the query to fetch all users
    const query = "SELECT * FROM accounts WHERE username = ? OR email = ?";

    // Execute the query with the provided parameters
    let result;
    try {
      result = (await database.query(query, [username, email])) as User[];
    } catch (error) {
      return stop(500); // Internal Server Error
    }

    // Check if the query returned any results
    if (result.length === 0) {
      return stop(404); // Stop the request with a 404 Not Found status
    }

    const verifyPass = await verify(result[0].password, password);

    if (!verifyPass) {
      return stop(401);
    }

    const token = await generateToken(result[0]);
    // Respond with the query result
    return res.json({ token: token, user: { ...result[0], password: undefined } });
  },
  0, // Priority (used in the route array structure for determining order or importance)
];
