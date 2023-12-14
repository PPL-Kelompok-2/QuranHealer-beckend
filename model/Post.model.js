import { MakeConnection } from "./makeConnection.js";
import dotenv from 'dotenv';
dotenv.config({path : '../'})

export class Post extends MakeConnection{
    constructor(){
        super()
    }

    async post(datas){
        const [result] = await this.pool.query(`
            INSERT INTO post (
                User_id,
                Username,
                Judul,
                Konten,
                Category_id) VALUES 
                ($1,$2,$3,$4,$5)
        `,[
            datas.User_id,
            datas.Username,
            datas.Judul,
            datas.Konten,
            datas.Category_id
        ])
        return result
    }

    async allPost(){
        const [result] = await this.pool.query(`
            SELECT * FROM post
        `)
        return result
    }
}
const datasw = new Post();
console.log(datasw.allPost())