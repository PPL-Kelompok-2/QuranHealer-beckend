import User from "./User.js";
import Database from "./Connect.js";
import { Post } from "./Post.model.js";
import dotenv from "dotenv";
import { DataDevelopment } from "./DataDevelopment.js";
import { Ustadz } from "./Ustadz.model.js";
import { Logout } from "./Logout.js";
dotenv.config();

const Users = new User("USERS", "user_id");
const Category = new Database("CATEGORY", "id_category");
const SaveAyat = new Database("SAVEAYAT", "id_saveayat");
const Like = new Database("LIKEPOST", "id_liked");
const Comment = new Database("COMMENT", "id_comment");
const Posts = new Post();
const Ustadzs = new Ustadz();
const Logouts = new Logout();
const DDevelopment = new DataDevelopment();

Users.validasiData(["name", "email", "password", "gender"]);
// HARUS DITAMBAHIN UNTUK YANG LAINNYA JUGA?

export {
  Users,
  Category,
  SaveAyat,
  Post,
  Like,
  Comment,
  DDevelopment,
  Posts,
  Ustadzs,
  Logouts,
};
