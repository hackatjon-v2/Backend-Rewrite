import mysql from "mysql2";

export class Database {
  private connection: mysql.Connection;

  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.Host,
      user: process.env.User,
      password: process.env.Pass,
      database: process.env.Database,
      port: process.env.Port ? parseInt(process.env.Port) : 25889,
    });
  }

  async connect() {
    this.connection.connect();
  }

  async query(query: string, values: any[]) {
    return new Promise((resolve, reject) => {
      this.connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  async close() {
    this.connection.end();
  }
}
