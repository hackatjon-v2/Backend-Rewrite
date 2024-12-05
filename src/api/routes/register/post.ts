import { argon2i, hash } from "argon2"; // Import Argon2 hashing library for secure password hashing
import { Database } from "../../../database/database"; // Import custom database utility
import { RouteArrayed } from "../../../types/route"; // Import route type definition
import Auth from "../../../verifyToken"; // Import authorization utility

/**
 * @module UserPost
 * @description Handles user registration by storing a new user's credentials in the database.
 *
 * @route POST /register
 * @requires Authorization header with a valid API key
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The request body containing user details.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @param {string} req.body.email - The email of the new user.
 * @param {Object} res - The HTTP response object used to send responses.
 * @param {Function} stop - A utility function to terminate the request early with a specific status code.
 *
 * @returns {Object} Response object with success message or error status.
 */
export const UserPost: RouteArrayed = [
  "post", // HTTP method for the route
  "/register", // API endpoint
  /**
   * Route handler for user registration.
   * Validates API key, hashes the password, and inserts user details into the database.
   *
   * @async
   */
  async (req, res, stop) => {
    const auth = new Auth(process.env.API_KEY); // Instantiate Auth with the API key from environment variables

    // Check if the 'Authorization' header is present
    if (!req.headers.authorization) return stop(401); // Stop with a 401 Unauthorized status

    // Validate the API key
    if (!auth.validateApiKey(req)) {
      return stop(403); // Stop with a 403 Forbidden status if validation fails
    }

    // Extract user details from the request body
    const { username, password, email } = req.body;

    // Ensure all required fields are provided
    if (!password || !(username || email)) {
      res.json({ message: "Missing Credentials" });
      return stop(400); // Stop with a 400 Bad Request status if fields are missing
    }

    // Hash the password using Argon2 for security
    const hashedPassword = await hash(password, {
      type: argon2i, // Use Argon2i variant
      memoryCost: 2 ** 16, // Memory cost for resistance against GPU attacks
      timeCost: 2, // Time cost (number of iterations)
      hashLength: 16, // Output hash length
    });

    const database = new Database(); // Initialize database connection
    try {
      database.connect();
    } catch (error) {
      return stop(500); // Internal Server Error
    }

    // SQL query to insert user details into the accounts table
    const query = "INSERT INTO accounts (username, password, email) VALUES (?, ?, ?)";

    // Execute the query with user details
    await database.query(query, [username, hashedPassword, email]);

    database.close(); // Close the database connection

    // Respond with a success message
    return res.json({ message: "User registered successfully" });
  },
  0, // Priority (used in route definition for execution order)
];
