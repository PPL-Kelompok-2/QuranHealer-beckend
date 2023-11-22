import Database from "./Connect.js";
import { passwordCheck, passwordKosong } from "../src/utils/passwordCheck.js";

class User extends Database {
  constructor(tableName, id) {
    super(tableName, id);
  }

  async login(email, password) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM ${this.table} WHERE EMAIL = $1`,
        [email]
      );
      if (!result.rows.length) {
        throw new Error("data tidak ada");
      }
      if (password == result.rows[0].password) {
        return result.rows[0];
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
            SET password = $1
            WHERE user_id = $2;
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
            SET password = $1
            WHERE email = $2;
        `,
      [PasswordBaru, email]
    );
    return "Berhasil";
  }

  async emailAda(email) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM ${this.table} WHERE EMAIL = $1`,
        [email]
      );
      if (!result.rows.length) {
        throw new Error("data tidak ada");
      }
      return row;
    } catch (err) {
      throw new Error(err);
    }
  }

  async verifEmail(id) {
    try {
      const result = await this.pool.query(
        `
            UPDATE USERS
            SET email_verif = true
            WHERE user_id = $1;
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
