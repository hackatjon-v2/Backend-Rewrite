import { LogItem } from "./types/logging";

export const LOG: LogItem[] = [];

export function Log(message: string, origin = "API", ...subs: string[]) {
  LOG.push({
    message,
    origin,
    subs: subs || [],
    timestamp: new Date().getTime(),
  });

  console.log(
    `${origin}: ${subs.join(": ") + (subs.length ? ": " : "")}${message}`
  );
}
