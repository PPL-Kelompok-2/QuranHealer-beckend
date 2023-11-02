import pg from "pg";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
const { Pool } = pg;

console.log(process.env.POSTGRES_URL);

const pool = new Pool({
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

// Kemudian, Anda dapat menggunakan pool untuk menjalankan operasi database
pool.query("SELECT * FROM USERS", (err, res) => {
  if (err) {
    console.error(err);
  } else {
    console.log(res.rows);
  }
});

// Akhiri pool saat aplikasi berakhir
pool.end();
