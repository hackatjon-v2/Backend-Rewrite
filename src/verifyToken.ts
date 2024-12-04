import type { Request } from "express";

export default class Auth {
  private API_KEY: string = "";
  constructor(apiKey: string | undefined) {
    if (!apiKey) {
      process.exit(1);
    }
    this.API_KEY = apiKey;
  }

  validateApiKey(request: Request) {
    const split = (request.headers.authorization || "").split(" ");
    const token = split[split.length-1];
    
    return token == this.API_KEY;
  }
}
