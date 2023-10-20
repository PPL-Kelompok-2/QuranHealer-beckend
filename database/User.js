import Database from "./connectDatabase.js";
import dotenv from "dotenv";
dotenv.config();

class User extends Database {
  constructor(tableName, id) {
    super(tableName, id);
  }

  async login(email, password) {
    try {
      const [row] = await this.pool.query(
        `SELECT * FROM ${this.table} WHERE EMAIL = ?`,
        [email]
      );
      if (!row.length) {
        throw new Error("data tidak ada");
      }
      if (password == row[0].password) {
        return row;
      }
      throw new Error("password salah");
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default User;
