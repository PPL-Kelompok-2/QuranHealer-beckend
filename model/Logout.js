import { MakeConnection } from "./makeConnection.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export class Logout extends MakeConnection{
    constructor(){
        super()
    }
    async doLogout(idUser,token){
        const result = await this.pool.query("insert into logout(User_id, Token) values($1, $2) returning Id_logout",[idUser, token])
        if(result.rows.length) return [result.rows[0],null];
        return [null, new Error("Data gagal dimasukkan")]
    }
    async cekTokenLogout(token){
        const result = await this.pool.query("select *from logout where Token = $1", [token])
        if(result.rows.length) return [null, new Error("Invalid Token")];
        return ["Data Tidak Ada", null]
    }
}

const logout = new Logout();

    async function init(){
        try {
        const [result, error] = await logout.doLogout(1,'qwewsredtfgbhnjkjm');
        if(error){
            throw error
        }
        console.log(result)
        const [result2, error2] = await logout.cekTokenLogout('qwewsredtfgbhnjkjm')
        if(error2){
            throw error2
        }
        console.log(result2);
    } catch (error) {
        console.log(error.message)
    }
    }
init()
