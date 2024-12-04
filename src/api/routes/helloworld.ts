import { RouteArrayed } from "../../types/route";

export const HelloWorld: RouteArrayed = [
  "get",
  "/helloworld",
  (_, res) => {
    res.status(200).json({ hello: "World" });
  },
  0,
];
