import db from "./db";
import { User } from "./types";

export async function createUser(email: string, password: string) {
  const result = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(email, password);

  await new Promise((res) =>
    setTimeout(() => {
      res("");
    }, 2000)
  );

  return result.lastInsertRowid;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  await new Promise((res) =>
    setTimeout(() => {
      res("");
    }, 2000)
  );

  return db.prepare("SELECT * FROM users WHERE email = ?").get(email) as User;
}
