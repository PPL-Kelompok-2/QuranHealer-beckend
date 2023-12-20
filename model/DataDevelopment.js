import User from "./User.js";

export class DataDevelopment extends User {
  constructor() {
    super();
  }
  async getAllDataUsers() {
    try {
      const allData = await this.pool.query(`
            SELECT * FROM USERS
        `);
      console.log(allData);
      return allData.rows;
    } catch (err) {
      throw err;
    }
  }
  async deleteData(email) {
    try {
      await this.pool.query(
        `
                DELETE FROM USERS WHERE email = $1
            `,
        [email]
      );
      const dataEmail = await this.pool.query(
        `
                SELECT * FROM USERS WHERE email = $1
            `,
        [email]
      );
      if (!dataEmail.rows.length) return "Berhasil didelete";
      throw new Error("data gagal di delete");
    } catch (err) {
      throw err;
    }
  }
}
