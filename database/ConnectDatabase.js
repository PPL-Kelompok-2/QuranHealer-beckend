import mysql from "mysql2";

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
  validasiData(data) {
    this.validasiDataLengkap = (keys) => {
      for (const datas in data) {
        if (!data.includes(keys[datas])) {
          throw new Error("data kurang atau tidak lengkap");
        }
      }
    };

    this.dataBolehDiubah = (keys) => {
      for (const datas in keys) {
        if (!data.includes(keys[datas])) {
          throw new Error("data salah");
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

  // dimasukkan menggunakan tipe data array
  set dataDilarangUbah(data) {
    this.dataLarang = data;
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
    //jika terdapat perubahan password
    const keys = Object.keys(dataUbah);
    const values = Object.values(dataUbah);
    this.dataBolehDiubah(keys);
    this.validasiDataKosong(values);
    this.validasiJumlahData(keys);

    if (this.dataLarang.length) {
      for (let i = 0; i < keys.length; i++) {
        if (this.dataLarang.includes(keys[i])) {
          throw new Error("data yang ingin diubah dilarang diubah");
        }
      }
    }

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
