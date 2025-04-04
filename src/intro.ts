import { Log } from "./logging";

const LINES = [
  " __     __    __     ______     ______   ______   __     ______     __     ______     __   __     ______     __  __        ______     ______   __    ",
  '/\\ \\   /\\ "-./  \\   /\\  ___\\   /\\  ___\\ /\\  ___\\ /\\ \\   /\\  ___\\   /\\ \\   /\\  ___\\   /\\ "-.\\ \\   /\\  ___\\   /\\ \\_\\ \\      /\\  __ \\   /\\  == \\ /\\ \\   ',
  "\\ \\ \\  \\ \\ \\-./\\ \\  \\ \\  __\\   \\ \\  __\\ \\ \\  __\\ \\ \\ \\  \\ \\ \\____  \\ \\ \\  \\ \\  __\\   \\ \\ \\-.  \\  \\ \\ \\____  \\ \\____ \\     \\ \\  __ \\  \\ \\  _-/ \\ \\ \\  ",
  " \\ \\_\\  \\ \\_\\ \\ \\_\\  \\ \\_____\\  \\ \\_\\    \\ \\_\\    \\ \\_\\  \\ \\_____\\  \\ \\_\\  \\ \\_____\\  \\ \\_\\  \\_\\  \\ \\_____\\  \\/\\_____\\     \\ \\_\\ \\_\\  \\ \\_\\    \\ \\_\\ ",
  "  \\/_/   \\/_/  \\/_/   \\/_____/   \\/_/     \\/_/     \\/_/   \\/_____/   \\/_/   \\/_____/   \\/_/ \\/_/   \\/_____/   \\/_____/      \\/_/\\/_/   \\/_/     \\/_/ ",
];

export const EchoIntro = () => LINES.forEach((l) => Log(l, ``));
