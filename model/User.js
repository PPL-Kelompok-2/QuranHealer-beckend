import Database from "./ConnectDatabase.js";
import { passwordCheck, passwordKosong } from "../src/utils/passwordCheck.js";

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

  async gantiPassword(id, passwordLama, PasswordBaru) {
    passwordKosong(passwordLama, PasswordBaru);
    if (await passwordCheck(id, passwordLama, this.pool)) {
      this.pool.query(
        `
            UPDATE USERS
            SET password = ?
            WHERE user_id = ?;
        `,
        [PasswordBaru, id]
      );
      return "Berhasil";
    }
    throw new Error("password salah");
  }

  async gantiPasswordEmail(email, PasswordBaru) {
    if (!PasswordBaru) {
      throw new Error("password kosong");
    }
    this.pool.query(
      `
            UPDATE USERS
            SET password = ?
            WHERE email = ?;
        `,
      [PasswordBaru, email]
    );
    return "Berhasil";
  }

  async emailAda(email) {
    try {
      const [row] = await this.pool.query(
        `SELECT * FROM ${this.table} WHERE EMAIL = ?`,
        [email]
      );
      if (!row.length) {
        throw new Error("data tidak ada");
      }
      return row;
    } catch (err) {
      throw new Error(err);
    }
  }

  async verifEmail(id) {
    try {
      const [row] = await this.pool.query(
        `
            UPDATE USERS
            SET email_verif = true
            WHERE user_id = ?;
        `,
        [id]
      );
      return "Data berhasil diverifikasi";
    } catch (err) {
      throw new Error(err);
    }
  }
}

export default User;
