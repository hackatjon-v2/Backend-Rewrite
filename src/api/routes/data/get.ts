import { Database } from "../../../database/database";
import { Queries } from "../../../types/queries";
import { RouteArrayed } from "../../../types/route";
import Auth from "../../../verifyToken";

/**
 * @module Data
 * @description This module defines a route for fetching data from a database based on group parameters.
 */

export const Data: RouteArrayed = [
  "get", // HTTP method
  "/data", // Route endpoint
  /**
   * Route handler for "/data".
   *
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @param {Function} stop - A utility function to terminate the request early with a specific status code.
   */
  async (req, res, stop) => {
    const getParams = req.query.group; // Get the 'group' query parameter from the request
    const auth = new Auth(process.env.API_KEY); // Instantiate the Auth class with the API key from environment variables

    // Check if the 'Authorization' header is present
    if (!req.headers.authorization) return stop(401); // Stop the request with a 401 Unauthorized status

    // Validate the API key using the Auth class
    if (!auth.validateApiKey(req)) {
      return stop(403); // Stop the request with a 403 Forbidden status if validation fails
    }

    // Define queries mapped to different groups
    const queries: Queries = {
      gps: "SELECT speed, Loc_Lat, Loc_Lon, Loc_Nsat FROM data3;",
      sot: "SELECT v24, v48, Iin, Iout, VAid_E, PCB_T, State, Sts, Sol_V, Sol_E FROM data3;",
      gens: "SELECT Reg_A1, Reg_A3, Reg_A4, Reg_A5, Reg_A6, Reg_A12, Reg_A16, Reg_A28 FROM data3;",
      heater: "SELECT Htr_V, Htr_I, Htr_P_t, Htr_E, Htr_T FROM data3;",
      grid: "SELECT Mns_V, Mns_I, Mns_P_in_t, Mns_P_out_t, Mns_Ein, Mns_Eout FROM data3;",
      bat: "SELECT Bat_V, Bat_I, Bat_P_vi, Bat_Ein, Bat_Eout, Bat_T, Bat_SoC FROM data3;",
      sense:
        "SELECT VAid1_V1, VAid1_V2, VAid1_V3, VAid1_I, VAid1_P_vi, VAid1_T, VAid2_v1, VAid2_V2, VAid2_V3, VAid2_I, VAid2_P_vi, VAid2_T FROM data3;",
      metadata: "SELECT DeviceId, Ctr_Id, VAid_Id, VAid2_Id, Ts FROM data3;",
    };

    const database = new Database(); // Instantiate the database object
    try {
      database.connect();
    } catch (error) {
      return stop(500); // Internal Server Error
    }

    // Check if a specific group was requested
    if (getParams) {
      const query = queries[getParams as keyof Queries]; // Get the corresponding query
      if (!query) {
        res.json({ error: "Invalid group" }); // Respond with an error message if the group is invalid
        stop(400); // Stop the request with a 400 Bad Request status
      }

      const result = await database.query(query, []); // Execute the query
      console.log(result); // Log the result to the console (for debugging)
      return res.json(result); // Respond with the query result
    }

    // If no specific group is requested, fetch all data
    const result = await database.query("SELECT * FROM data3;", []);
    return res.json(result); // Respond with all data from the table
  },
  0, // Priority (used in the route array structure for determining order or importance)
];
