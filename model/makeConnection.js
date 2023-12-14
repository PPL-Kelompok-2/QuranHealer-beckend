import pg from 'pg';
const {Pool} = pg;

export class MakeConnection {
    constructor(){
        this.pool = new Pool({
            connectionString: process.env.POSTGRES_URL,
            user: process.env.POSTGRES_USER,
            host: process.env.POSTGRES_HOST,
            password: process.env.POSTGRES_PASSWORD,
            database: process.env.POSTGRES_DATABASE,
            ssl: {
                // Aktifkan SSL dengan mode require
                rejectUnauthorized: false, // Setel false jika tidak memerlukan verifikasi sertifikat
            },
        });
    }
}