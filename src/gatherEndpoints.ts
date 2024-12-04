import { App } from "./api/index"; // Import the Express application instance
import { Stack } from "./types/stack"; // Import the type definition for the Express stack

/**
 * @module gatherEndpoints
 * @description Gathers all registered API endpoints and their associated HTTP methods from the Express application.
 *
 * @returns {Array<{ path: string, methods: string[] }>} - Array of endpoint objects, each containing:
 *  - `path` (string): The URL path of the endpoint.
 *  - `methods` (string[]): A list of HTTP methods supported by the endpoint.
 */
export default function gatherEndpoints() {
  // Access the internal router stack of the Express application and filter valid routes
  const stack = (App._router.stack as Stack).filter(
    (r) => r.route && r.route.methods // Ensure the stack entry has a route with defined methods
  );

  /**
   * Object to store endpoint details keyed by path.
   * Structure:
   * {
   *   [path: string]: {
   *     path: string; // The API endpoint's path
   *     methods: string[]; // Array of supported HTTP methods (e.g., GET, POST)
   *   }
   * }
   */
  const endpoints: Record<string, { path: string; methods: string[] }> = {};

  // Iterate through the filtered router stack to extract endpoints
  stack.forEach((r) => {
    const path = r.route.path; // Extract the route's URL path
    const methods = Object.keys(r.route.methods); // Get an array of HTTP methods supported by the route

    // If the path already exists in the endpoints object, merge the methods
    if (endpoints[path]) {
      endpoints[path].methods.push(...methods);
    } else {
      // Otherwise, add a new entry for the path
      endpoints[path] = { path, methods };
    }
  });

  // Convert the endpoints object into an array and return it
  return Object.values(endpoints);
}
