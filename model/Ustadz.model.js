import { MakeConnection } from "./makeConnection.js";
// import dotenv from "dotenv";
// dotenv.config({ path: "../.env" });

export class Ustadz extends MakeConnection {
  constructor() {
    super();
  }
  async listUstadz() {
    const datas = await this.pool.query(`
        SELECT Users.user_id, Users.name, spesialisasi.spesialisasi, gender FROM Users
        INNER JOIN spesialisasi ON Users.user_id = spesialisasi.user_id WHERE Users.role = 'ustadz';
    `);
    return datas.rows;
  }
}

// const ustadz = new Ustadz();
// ustadz.listUstadz().then((data) => {
//   console.log(data);
// });
