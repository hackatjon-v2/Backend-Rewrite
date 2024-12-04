import { Log } from "./logging";

const LINES = [
  "Express.JS Skeleton",
  "",
  "Put any wonderful ascii art you want to display in this array.",
];

export const EchoIntro = () => LINES.forEach((l) => Log(l, ``));
