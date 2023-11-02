// digunakan supaya jest testing bisa untuk membaca dotenv file

import path from "path";
import dotenv from "dotenv";
dotenv.config();

export default {
  rootDir: path.resolve("./"), // Sesuaikan dengan lokasi proyek Anda
};
