import Database from "./Connect.js";
import { passwordCheck, passwordKosong } from "../src/utils/passwordCheck.js";

class User extends Database {
  constructor(tableName, id) {
    super(tableName, id);
  }

  async getRole(user_id) {
    const result = await this.pool.query(
      `
      SELECT role FROM Users WHERE user_id = $1
    `,
      [user_id]
    );
    return result.rows[0].role;
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
    await this.pool.query(
      `
            UPDATE USERS
            SET password = $1
            WHERE email = $2;
        `,
      [PasswordBaru, email]
    );
    const passwordDirubah = await this.pool.query(
      `
      SELECT * FROM USERS WHERE email = $1
    `,
      [email]
    );
    if (passwordDirubah.rows[0].password == PasswordBaru) return "berhasil";
    throw new Error("Gagal ditambahkan");
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
      return result.rows;
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

  async getNotif(user_id, indexes) {
    const result = await this.pool.query(
      `
      SELECT * FROM notif WHERE user_id = $1 order by created_at DESC LIMIT 10 OFFSET $2
    `,
      [user_id, indexes * 10 - 10]
    );
    const blm_dibaca = await this.pool.query(
      `
      SELECT  count(*) from notif where is_read = false
    `,
      [user_id, indexes * 10 - 10]
    );
    return [result.rows, blm_dibaca];
  }

  async getDataNotif(user_id, id_notif) {
    const userAuthorize = await this.pool.query(
      `SELECT * FROM notif WHERE id_notif = $1 AND user_id = $2`,
      [id_notif, user_id]
    );
    // check user authorize
    if (!userAuthorize.rows.length) return [null, new Error("Unauthorized")];
    // get data
    const result = await this.pool.query(
      `
      SELECT * FROM notif WHERE id_notif = $1
    `,
      [id_notif]
    );

    await this.pool.query(
      `
      UPDATE notif SET is_read = true WHERE id_notif = $1
    `,
      [id_notif]
    );

    return result.rows[0];
  }

  async addNotif(User_id, id_post, status, id_comment = null) {
    const result = await this.pool.query(
      `
      INSERT INTO notif (user_id,id_post, status, id_comment, is_read) VALUES ($1,$2,$3,$4,$5) RETURNING id_notif
    `,
      [User_id, id_post, status, id_comment, false]
    );
    if (!result.rows.length) {
      return [null, new Error("gagal memasukkan data notif")];
    }
    return [result.rows[0].id_notif, null];
  }
}

export default User;
