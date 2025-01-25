import db from "./db";

export async function createUser(email: string, password: string) {
  const result = db.prepare("INSERT INTO users (email, password) VALUES (?, ?)").run(email, password);

  await new Promise((res) =>
    setTimeout(() => {
      res("");
    }, 2000)
  );

  return result.lastInsertRowid;
}
