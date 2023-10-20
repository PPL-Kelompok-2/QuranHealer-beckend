import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

class Users {
  static async listUser() {
    const hasil = await pool.query("SELECT * FROM USERS");
    return hasil[0];
  }

  static async getUser(user_id) {
    const hasil = await pool.query(
      `
      SELECT * FROM USERS WHERE user_id = ?
    `,
      [user_id]
    );

    return hasil[0];
  }

  static async addUser(name, email, password, telp, gender, role) {
    const hasil = await pool.query(
      `
      INSERT INTO USERS (name, email, password, telp, gender, role) 
      VALUES (?,?,?,?,?,?)
    `,
      [name, email, password, telp, gender, role]
    );

    return hasil[0].insertId;
  }

  // memasukkan data menggunakan object untuk parameter ke 2
  static async updateUser(id, dataUbah) {
    for (const key in dataUbah) {
      try {
        console.log(key, dataUbah[key]);
        await pool.query(
          `
              UPDATE USERS
              SET ${key} = ?
              WHERE user_id = ?;
          `,
          [dataUbah[key], id]
        );
      } catch (err) {
        return err;
      }
    }
    return "berhasil";
  }

  static async deleteUser(id) {
    const hasil = await pool.query(
      `
      DELETE FROM USERS WHERE user_id = ?
    `,
      [id]
    );

    return hasil;
  }
}
