import Database from "./connectDatabase.js";
import dotenv from "dotenv";
dotenv.config();

const Users = new Database("USERS", "user_id", ["name", "email", "password"]);
const Category = new Database("CATEGORY", "id_category");
const SaveAyat = new Database("SAVEAYAT", "id_saveayat");
const Post = new Database("POST", "id_post");
const Like = new Database("LIKEPOST", "id_liked");
const Comment = new Database("COMMENT", "id_comment");

Users.validasiData(["name", "email", "password", "telp", "gender", "role"]);
// HARUS DITAMBAHIN UNTUK YANG LAINNYA JUGA

export { Users, Category, SaveAyat, Post, Like, Comment };
