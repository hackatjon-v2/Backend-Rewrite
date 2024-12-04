import { RouteStore } from "../types/route";
import { Data } from "./routes/data/get";
import { GatherEndpoints } from "./routes/gatherEndpoints";
import { UserGet } from "./routes/login/post";
import { Logs } from "./routes/logs/get";
import { UserPost } from "./routes/register/post";

export function Routes(): RouteStore {
  return [GatherEndpoints, Logs, Data, UserGet, UserPost];
}
