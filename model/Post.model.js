import { MakeConnection } from "./makeConnection.js";
// import dotenv from "dotenv";
// dotenv.config({ path: "../.env" });

export class Post extends MakeConnection {
  constructor() {
    super();
  }

  async allPost(indexes, Id_user_ustadz = null, user_id) {
    const datas = Id_user_ustadz
      ? await this.pool.query(
          `
                  SELECT * FROM post WHERE Id_user_ustadz = $2 ORDER BY created_at DESC LIMIT 10 OFFSET $1
              `,
          [indexes * 10 - 10, Id_user_ustadz]
        )
      : await this.pool.query(
          `
                  SELECT * FROM post ORDER BY created_at DESC LIMIT 10 OFFSET $1
              `,
          [indexes * 10 - 10]
        );
    const result = await this.getDataForListPost(datas, user_id);
    return result;
  }

  async postByUser(indexes, user_id) {
    const datas = await this.pool.query(
      `
        SELECT * FROM post WHERE user_id = $2 ORDER BY created_at DESC LIMIT 10 OFFSET $1
    `,
      [indexes * 10 - 10, user_id]
    );
    const result = await this.getDataForListPost(datas, user_id);
    return result;
  }

  async getDataForListPost(datas, idUser) {
    const promisesComment = datas.rows.map(async (obj) => {
      const {
        id_post,
        user_id,
        id_user_ustadz,
        judul,
        username,
        konten,
        created_at,
        updated_at,
      } = obj;
      const commentCount = await this.getCountComment(id_post);
      const up = await this.getCountUp(id_post);
      const down = await this.getCountDown(id_post);
      const isLiked = await this.isLiked(id_post, idUser);
      return {
        id_post,
        byUser: user_id == idUser ? true : false,
        username,
        id_user_ustadz,
        judul,
        konten,
        up,
        down,
        isLiked,
        commentCount,
        created_at,
        updated_at,
      };
    });
    const result = await Promise.all(promisesComment);
    return result;
  }

  async post(datas) {
    const result = await this.pool.query(
      `
            INSERT INTO post (
                User_id,
                Id_user_ustadz,
                Username,
                Judul,
                Konten,
                Category_id) VALUES 
                ($1,$2,$3,$4,$5,$6)
                RETURNING Id_post, judul
        `,
      [
        datas.user_id,
        datas.id_user_ustadz,
        datas.username,
        datas.judul,
        datas.konten,
        1,
      ]
    );
    if (result.rows.length > 0) {
      return [result.rows[0], null];
    }
    return [null, new Error("gagal memasukkan data")];
  }

  async getPost(Id_post, idUser) {
    const datas = await this.pool.query(
      `
            SELECT * FROM post WHERE Id_post = $1
        `,
      [Id_post]
    );
    if (!datas.rows.length) {
      return [null, new Error("data tidak ditemukan")];
    }
    const commentCount = await this.getCountComment(Id_post);
    const up = await this.getCountUp(Id_post);
    const down = await this.getCountDown(Id_post);
    const isLiked = await this.isLiked(Id_post, idUser);
    const {
      id_post,
      user_id,
      id_user_ustadz,
      judul,
      username,
      konten,
      created_at,
      updated_at,
    } = datas.rows[0];

    const resultComment = await this.getComment(Id_post);
    const comment = [];
    if (resultComment) {
      const result = this.transformComment(resultComment, null, idUser);
      comment.push(...result);
    }

    return [
      {
        id_post,
        // user_id,
        username,
        byUser: user_id == idUser ? true : false,
        id_user_ustadz,
        judul,
        konten,
        up,
        down,
        isLiked,
        commentCount,
        created_at,
        updated_at,
        comment,
      },
      null,
    ];
  }

  async isLiked(idPost, idUser) {
    const result = await this.pool.query(
      `
      SELECT liked FROM liked WHERE id_post = $1 AND user_id = $2
    `,
      [idPost, idUser]
    );
    if (!result.rows.length) {
      return null;
    }
    return result.rows[0].liked;
  }

  async liked(datas) {
    const { user_id, id_post, liked = true } = datas;
    // check is liked column is same as on database
    const checkLiked = await this.pool.query(
      `
            SELECT * FROM liked WHERE Id_post = $1 AND User_id = $2
        `,
      [id_post, user_id]
    );
    if (checkLiked.rows.length > 0 && checkLiked.rows[0].liked === liked) {
      return ["data sudah ada", null];
    }
    // jika data berbeda
    await this.pool.query(
      `DELETE FROM liked WHERE Id_post = $1 AND User_id = $2`,
      [id_post, user_id]
    );
    const result = await this.pool.query(
      `
            INSERT INTO liked (User_id, Id_post, Liked) VALUES 
            ($1,$2,$3) RETURNING Id_liked;
        `,
      [user_id, id_post, liked]
    );
    if (result.rows.length > 0) {
      return ["data berhasil dimasukkan", null];
    }
    return [null, new Error("gagal memasukkan data")];
  }

  async addComment(datas) {
    const { user_id, id_post, id_toComment = null, comment } = datas;
    const result = await this.pool.query(
      `
        INSERT INTO comment (User_id, Id_post, id_toComment, Comment) VALUES 
        ($1,$2,$3,$4) RETURNING Id_comment;
    `,
      [user_id, id_post, id_toComment, comment]
    );
    if (result.rows.length > 0) {
      return ["data berhasil dimasukkan", null, result.rows[0].id_comment];
    }
    return [null, new Error("gagal memasukkan data")];
  }

  //UTILS
  async getCountComment(id_post) {
    const commentCount = await this.pool.query(
      `
        SELECT COUNT(*) FROM Comment WHERE Id_post = $1
      `,
      [id_post]
    );
    return commentCount.rows[0].count;
  }
  async getCountUp(id_post) {
    const up = await this.pool.query(
      `
          SELECT COUNT(*) FROM liked WHERE Id_post = $1 AND liked = TRUE
        `,
      [id_post]
    );
    return up.rows[0].count;
  }

  async getCountDown(id_post) {
    const down = await this.pool.query(
      `
          SELECT COUNT(*) FROM liked WHERE Id_post = $1 AND liked = FALSE
        `,
      [id_post]
    );
    return down.rows[0].count;
  }

  async likedByUsers(user_id, Id_post) {
    const likedByUser = await this.pool.query(
      `
        SELECT Liked FROM liked WHERE User_id = $1 AND Id_post = $2 ;
    `,
      [user_id, Id_post]
    );
    if (!likedByUser.rows.length) {
      return undefined;
    }
    return likedByUser.rows[0].liked;
  }

  async getComment(Id_post) {
    const result = await this.pool.query(
      `
        SELECT Users.Name, Users.Role, comment.*
        FROM comment
        INNER JOIN Users ON comment.User_id = Users.User_id WHERE Id_post = $1;
    `,
      [Id_post]
    );
    if (result.rows.length) {
      return result.rows;
    }
  }

  async deletePost(idPost, idUser) {
    const userAuthorize = await this.pool.query(
      `SELECT * FROM post WHERE id_post = $1 AND user_id = $2`,
      [idPost, idUser]
    );
    // check user authorize
    if (!userAuthorize.rows.length) return [null, new Error("Unauthorized")];
    // delete post
    await this.pool.query("DELETE FROM post WHERE id_post = $1", [idPost]);
    const result = await this.pool.query(
      "SELECT * FROM post WHERE id_post = $1",
      [idPost]
    );
    if (result.rows.length) return [null, new Error("data gagal dihapus")];
    return ["data berhasil dihapus", null, idPost];
  }

  async deleteComment(idComment, idUser) {
    const userAuthorize = await this.pool.query(
      `SELECT * FROM comment WHERE id_comment = $1 AND user_id = $2`,
      [idComment, idUser]
    );
    // check user authorize
    if (!userAuthorize.rows.length) return [null, new Error("Unauthorized")];
    // delete post
    await this.pool.query("DELETE FROM comment WHERE id_comment = $1", [
      idComment,
    ]);
    const result = await this.pool.query(
      "SELECT * FROM comment WHERE id_comment = $1",
      [idComment]
    );
    if (result.rows.length) return [null, new Error("data gagal dihapus")];
    return ["data berhasil dihapus", null, idComment];
  }

  async editPost(idUser, idPost, datas) {
    const userAuthorize = await this.pool.query(
      `SELECT * FROM post WHERE id_post = $1 AND user_id = $2`,
      [idPost, idUser]
    );
    // check user authorize
    if (!userAuthorize.rows.length) return [null, new Error("Unauthorized")];
    // edit post
    const dataPost = await this.pool.query(
      `
      SELECT username, judul, konten FROM post WHERE id_post = $1
    `,
      [idPost]
    );
    const {
      username = dataPost.rows[0].username,
      judul = dataPost.rows[0].judul,
      konten = dataPost.rows[0].konten,
    } = datas;
    const result = await this.pool.query(
      `
      UPDATE post SET username = $1, judul = $2, konten = $3 WHERE id_post = $4 RETURNING username;
    `,
      [username, judul, konten, idPost]
    );
    if (username == result.rows[0].username) {
      return ["berhasil diubah", null];
    }
    return [null, new Error("data gagal dirubah")];
  }

  async editComment(idUser, idComment, comment) {
    const userAuthorize = await this.pool.query(
      `SELECT * FROM comment WHERE id_comment = $1 AND user_id = $2`,
      [idComment, idUser]
    );
    // check user authorize
    if (!userAuthorize.rows.length) return [null, new Error("Unauthorized")];
    // edit comment
    const result = await this.pool.query(
      `
      UPDATE comment SET comment = $1 WHERE id_comment = $2 RETURNING comment;
    `,
      [comment, idComment]
    );
    if (comment == result.rows[0].comment) {
      return ["berhasil diubah", null];
    }
    return [null, new Error("data gagal dirubah")];
  }

  async getUserIdByIdPost(idPost, idComment) {
    const result = await this.pool.query(
      `
      SELECT user_id FROM post WHERE id_post = $1
    `,
      [idPost]
    );
    if (idComment) {
      const comment = await this.pool.query(
        `
        SELECT * FROM comment WHERE id_comment = $1
      `,
        [idComment]
      );
      if (!comment.rows.length) {
        return [null, new Error("comment tidak ada")];
      }
    }
    if (result.rows.length) {
      return [result.rows[0].user_id, null];
    }
    return [null, new Error("post tidak ada")];
  }

  transformComment(inputArray, parentId = null, idUser) {
    const result = [];

    inputArray.forEach(async (item) => {
      if (item.id_tocomment === parentId) {
        const ustadz = item.role == "ustadz";
        const user = item.user_id == idUser;
        const transformedItem = {
          id_comment: item.id_comment,
          //   name: item.name,
          username: ustadz ? item.name : "anonymous",
          role: item.role,
          byUser: user,
          isiComment: item.comment,
          comment: this.transformComment(inputArray, item.id_comment, idUser),
        };
        result.push(transformedItem);
      }
    });
    return result;
  }
}

// const datas = {
//   User_id: 64,
//   Id_post: 12,
//   id_toComment: 16,
//   Comment: "halo",
// };

// const datasw = new Post();

// async function init() {
//   await datasw.getPost(12).then((data) => {});
// }

// init();
