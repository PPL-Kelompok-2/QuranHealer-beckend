import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

class Database {
  constructor(table, idRowName) {
    this.table = table;
    this.idRowName = idRowName;
  }

  async list() {
    const hasil = await pool.query(`SELECT * FROM ${this.table}`);
    return hasil[0];
  }

  async getData(id) {
    const hasil = await pool.query(
      `
      SELECT * FROM ${this.table} WHERE ${this.idRowName} = ?
    `,
      [id]
    );

    return hasil[0];
  }

  // memasukkan data menggunakan object untuk parameter
  async addData(data) {
    const { name, email, password, telp, gender, role } = data;

    const hasil = await pool.query(
      `
      INSERT INTO ${this.table} (name, email, password, telp, gender, role) 
      VALUES (?,?,?,?,?,?)
    `,
      [name, email, password, telp, gender, role]
    );

    return hasil[0].insertId;
  }

  // memasukkan data menggunakan object untuk parameter ke 2
  async updateData(id, dataUbah) {
    for (const key in dataUbah) {
      try {
        console.log(key, dataUbah[key]);
        await pool.query(
          `
              UPDATE ${this.table}
              SET ${key} = ?
              WHERE ${this.idRowName} = ?;
          `,
          [dataUbah[key], id]
        );
      } catch (err) {
        return err;
      }
    }
    return "berhasil";
  }

  async delete(id) {
    const hasil = await pool.query(
      `
      DELETE FROM ${this.table} WHERE ${this.idRowName} = ?
    `,
      [id]
    );

    return hasil;
  }
}

const Users = new Database("USERS", "user_id");
Users.list()
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
