import { LogItem } from "./types/logging";

export const LOG: LogItem[] = [];

export function Log(message: string, origin = "API", ...subs: string[]) {
  const logItem = {
    message,
    origin,
    subs: subs || [],
    timestamp: new Date().toLocaleString(),
  }
  LOG.push(logItem);

  console.log(
    `(${logItem.timestamp}) [${origin}] ${subs.join(": ") + (subs.length ? ": " : "")}${message}`
  );
}