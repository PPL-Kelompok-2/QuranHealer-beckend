import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

class Database {
  constructor(table, idRowName) {
    this.table = table;
    this.idRowName = idRowName;
    this.pool = mysql
      .createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
      })
      .promise();
  }

  // berisi array yang berisi kolom dalam table
  async validasiData(data) {
    this.validasiDataLengkap = (keys) => {
      for (const datas in data) {
        if (!data.includes(keys[datas])) {
          throw new Error("data kurang atau tidak lengkap");
        }
      }
    };

    this.validasiDataKosong = (values) => {
      for (const datas in data) {
        if (values[datas] == "") {
          throw new Error("terdapat data kosong");
        }
      }
    };

    this.validasiJumlahData = (keys) => {
      if (keys.length > data.length) {
        throw new Error("Data Terlalu Banyak");
      }
    };
  }

  async list() {
    const hasil = await this.pool.query(`SELECT * FROM ${this.table}`);
    return hasil[0];
  }

  async getData(id) {
    const hasil = await this.pool.query(
      `
      SELECT * FROM ${this.table} WHERE ${this.idRowName} = ?
    `,
      [id]
    );

    return hasil[0];
  }

  // memasukkan data menggunakan object untuk parameter
  async addData(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    this.validasiDataLengkap(keys);
    this.validasiDataKosong(values);
    this.validasiJumlahData(keys);

    const placeholders = values.map(() => "?").join(", ");

    const hasil = await this.pool.query(
      `
      INSERT INTO ${this.table} (${keys.join(", ")}) 
      VALUES (${placeholders})
    `,
      [...values]
    );

    return hasil[0].insertId;
  }

  // memasukkan data menggunakan object untuk parameter ke 2
  async updateData(id, dataUbah) {
    for (const key in dataUbah) {
      try {
        await this.pool.query(
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
    const hasil = await this.pool.query(
      `
      DELETE FROM ${this.table} WHERE ${this.idRowName} = ?
    `,
      [id]
    );

    return hasil;
  }
}

export default Database;
