import jwt from "jsonwebtoken";
import { User } from "./types/user";
import { Database } from "./database/database";

export async function generateToken(user: User) {
  const database = new Database();
  database.connect();

  const SECRET_KEY = process.env.SECRET_KEY;

  if (!SECRET_KEY) {
    process.exit(1);
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "7d",
  });

  await database.query("INSERT INTO sessions (token) VALUES (?)", [token]);

  database.close();
  return token;
}
