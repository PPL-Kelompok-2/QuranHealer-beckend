import User from "./User.js";

export class DataDevelopment extends User{
    constructor(){
        super()
    }
    async getAllDataUsers(){
        try{
        const allData = await this.pool.query(`
            SELECT * FROM USERS
        `)
        return allData.rows;
        }catch(err){
            throw err
        }
    }
}