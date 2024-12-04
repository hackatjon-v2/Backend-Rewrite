# Express.JS Skeleton

A stripped down version of the Sacruda API to be used as a base skeleton for easy Express.JS applications.

## Creating an endpoint

First create a `RouteArrayed` object in a new file in the `src/api/routes` folder, with an appropriate name that semi-matches the endpoint. For example:

```ts
import { RouteArrayed } from "../../types/route";

export const HelloWorld: RouteArrayed = [
  "get",
  "/helloworld",
  (_, res) => {
    res.status(200).json({ hello: "World" });
  },
  0,
];
```

Here's what it all means:

- `get` is the method (`get`, `post`, `delete`, `options`, `put`, `patch`, etc)
- `/helloworld` is the endpoint (starts with a `/`)
- the third argument is the callback for the function. It's got:
  - `req` which is the incoming request
  - `res` which is the outgoing response
  - `stop` is a function that easily stops the request. For example: `if (!token) return stop(401)`
- `0` is the Max requests per minute. Put a `0` here to disable rate limiting for this endpoint.

Secondly, add the newly created variable in the `Routes()` function in `src/api/stores.ts`, in the array it returns.

## Running the API

Use `npm run start` or `yarn dev` to start the API. Customize the port in `src/env.ts`.
