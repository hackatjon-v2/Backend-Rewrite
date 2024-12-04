import { RouteStore } from "../types/route";
import { HelloWorld } from "./routes/helloworld";

export function Routes(): RouteStore {
  return [HelloWorld];
}
