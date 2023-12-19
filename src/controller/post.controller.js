import { Posts, Users } from "../../model/Data.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { postValidation } from "../middleware/postValidation.js";
dotenv.config();

const secretKey = process.env.SECRETKEY;

export const postController = {
  async getPost(request, h) {
    const token = request.headers.authorization.split(" ")[1];
    try {
      const { idPost } = request.params;
      const idUser = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const [result, error] = await Posts.getPost(idPost, idUser);
      if (error) {
        throw error;
      }
      const role = await Users.getRole(idUser);
      return h.response({ message: "Token verified", role, result }).code(200);
    } catch (error) {
      return h.response({ error: error.message });
    }
  },
  async post(request, h) {
    const ustadz = request.query.ustadz || null;
    const page = request.query.page || 1;
    const token = request.headers.authorization.split(" ")[1];
    try {
      const userId = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const role = await Users.getRole(userId);
      const result = await Posts.allPost(page, ustadz, userId);
      return h.response({ message: "Token verified", role, result }).code(200);
    } catch (error) {
      return h.response({ error: error.message }).code(400);
    }
  },
  async userPost(request, h) {
    const page = request.query.page || 1;
    const token = request.headers.authorization.split(" ")[1];
    try {
      const userId = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
          if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const role = await Users.getRole(userId);
      if (!(role == "user")) {
        throw new Error("Unauthorized");
      }
      const result = await Posts.postByUser(page, userId);
      return h.response({ message: "Token verified", role, result }).code(200);
    } catch (error) {
      if (error.message == "Unauthorized") {
        return h.response({ error: error.message }).code(401);
      }
      return h.response({ error: error.message }).code(400);
    }
  },
  async addPost(request, h) {
    const token = request.headers.authorization.split(" ")[1];
    const ustadz = request.query.ustadz || null;
    try {
      if (!ustadz) {
        throw new Error("ustadz can not be null");
      }
      const userId = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const value = await postValidation.addPost(request);
      const role = await Users.getRole(userId);
      if (!(role == "user")) {
        throw new Error("Unauthorized");
      }
      const [result, error] = await Posts.post({
        user_id: userId,
        id_user_ustadz: ustadz,
        ...value,
      });
      if (error) {
        throw error;
      }
      // mengirim notif ke ustadz
      const [sendNotif, error2] = await Users.addNotif(
        ustadz,
        result.id_post,
        `Anda mendapatkan pertanyaan : ${result.judul}`
      );
      if (error2) {
        throw error2;
      }
      return h
        .response({ message: "Token verified", role, result: result.id_post })
        .code(200);
    } catch (error) {
      console.error(error);
      if (error.message == "Unauthorized") {
        return h.response({ error: error.message }).code(401);
      }
      return h.response({ error: error.message }).code(400);
    }
  },
  async addComment(request, h) {
    const { idPost, idComment = null } = request.params;
    const token = request.headers.authorization.split(" ")[1];
    try {
      const { comment } = await postValidation.addComment(request);
      const userId = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const [idUserFromPost, error] = await Posts.getUserIdByIdPost(
        idPost,
        idComment
      );
      const role = await Users.getRole(userId);
      if (error) {
        throw error;
      } else if (!(idUserFromPost == userId) && !(role == "ustadz")) {
        throw new Error("Unauthorized");
      }
      const [hasil, error2, result] = await Posts.addComment({
        user_id: userId,
        id_post: idPost,
        id_toComment: idComment,
        comment,
      });
      if (error2) {
        throw error;
      }
      // mengirim notif
      if (!(idUserFromPost == userId) && !idComment) {
        // mengirim notif jawaban ke pembuat post
        await Users.addNotif(
          idUserFromPost,
          idPost,
          "anda mendapatkan jawaban dari post anda"
        );
        console.log("mengirim notif jawaban ke pembuat post");
      } else if (!(idUserFromPost == userId) && idComment) {
        // mengirim notif ke jawaban comment ke pembuat post
        await Users.addNotif(
          idUserFromPost,
          idPost,
          "anda mendapatkan balasan dari comment anda",
          idComment
        );
      } else if (idComment) {
        // mengirim notif ke ustadz
        const [idUserFromComment, error3] = await Posts.getUserIdByIdComment(
          idComment
        );
        if (error3) {
          throw error3;
        }
        const roleComment = await Users.getRole(idUserFromComment);
        if (roleComment == "ustadz") {
          await Users.addNotif(
            // cari id ustadznya
            idUserFromComment,
            idPost,
            "anda mendapatkan comment dari jawaban anda",
            idComment
          );
        }
      } else {
        console.log("gagal");
      }
      return h.response({ message: "Token verified", role, result }).code(200);
    } catch (error) {
      console.error(error);
      if (error.message == "Unauthorized") {
        return h.response({ error: error.message }).code(401);
      }
      return h.response({ error: error.message }).code(400);
    }
  },
  async showNotif(request, h) {
    const token = request.headers.authorization.split(" ")[1];
    try {
      const userId = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const role = await Users.getRole(userId);
      const result = await Users.notif(userId);
      return h.response({ message: "Token verified", role, result }).code(200);
    } catch (error) {
      if (error.message == "Unauthorized") {
        return h.response({ error: error.message }).code(401);
      }
      return h.response({ error: error.message }).code(400);
    }
  },
  async like(request, h) {
    const result = await liked(request, h, true);
    return result;
  },
  async dislike(request, h) {
    const result = await liked(request, h, false);
    return result;
  },
  async deletePost(request, h) {
    const token = request.headers.authorization.split(" ")[1];
    const { idPost } = request.params;
    try {
      if (!idPost) {
        throw new Error("idPost can not be null");
      }
      const userId = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const role = await Users.getRole(userId);
      if (!(role == "user")) {
        throw new Error("Unauthorized");
      }
      const [result, error] = await Posts.deletePost(idPost, userId);
      if (error) {
        throw error;
      }
      return h.response({ message: "Token verified", role, result }).code(200);
    } catch (error) {
      if (error.message == "Unauthorized") {
        return h.response({ error: error.message }).code(401);
      }
      return h.response({ error: error.message }).code(400);
    }
  },
  async deleteComment(request, h) {
    const token = request.headers.authorization.split(" ")[1];
    const { idComment } = request.params;
    try {
      if (!idComment) {
        throw new Error("idComment can not be null");
      }
      const userId = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const [result, error] = await Posts.deleteComment(idComment, userId);
      if (error) {
        throw error;
      }
      const role = await Users.getRole(userId);
      return h.response({ message: "Token verified", role, result }).code(200);
    } catch (error) {
      if (error.message == "Unauthorized") {
        return h.response({ error: error.message }).code(401);
      }
      return h.response({ error: error.message }).code(400);
    }
  },
  async editPost(request, h) {
    const token = request.headers.authorization.split(" ")[1];
    const { idPost } = request.params;
    try {
      if (!idPost) {
        throw new Error("idPost can not be null");
      }
      const userId = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const values = await postValidation.editPost(request);
      const [result, error] = await Posts.editPost(userId, idPost, values);
      if (error) {
        throw error;
      }
      const role = await Users.getRole(userId);
      return h.response({ message: "Token verified", role, result }).code(200);
    } catch (error) {
      if (error.message == "Unauthorized") {
        return h.response({ error: error.message }).code(401);
      }
      return h.response({ error: error.message }).code(400);
    }
  },
  async editComment(request, h) {
    const token = request.headers.authorization.split(" ")[1];
    const { idComment } = request.params;
    try {
      if (!idComment) {
        throw new Error("idComment can not be null");
      }
      const userId = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const { comment } = await postValidation.addComment(request);
      const [result, error] = await Posts.editComment(
        userId,
        idComment,
        comment
      );
      if (error) {
        throw error;
      }
      const role = await Users.getRole(userId);
      return h.response({ message: "Token verified", role, result }).code(200);
    } catch (error) {
      if (error.message == "Unauthorized") {
        return h.response({ error: error.message }).code(401);
      }
      return h.response({ error: error.message }).code(400);
    }
  },
  async getNotif(request, h) {
    const token = request.headers.authorization.split(" ")[1];
    const page = request.query.page || 1;
    try {
      const userId = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const result = await Users.getNotif(userId, page);
      const role = await Users.getRole(userId);
      return h.response({ message: "Token verified", role, result }).code(200);
    } catch (error) {
      if (error.message == "Unauthorized") {
        return h.response({ error: error.message }).code(401);
      }
      return h.response({ error: error.message }).code(400);
    }
  },
  async getDataNotif(request, h) {
    const token = request.headers.authorization.split(" ")[1];
    const { idNotif } = request.params;
    try {
      const userId = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const result = await Users.getDataNotif(userId, idNotif);
      const role = await Users.getRole(userId);
      return h
        .response({
          message: "Token verified",
          role,
          result: {
            id_notif: result.id_notif,
            id_post: result.id_post,
            id_comment: result.id_comment,
            status: result.status,
            is_read: result.is_read,
            created_at: result.created_at,
          },
        })
        .code(200);
    } catch (error) {
      if (error.message == "Unauthorized") {
        return h.response({ error: error.message }).code(401);
      }
      return h.response({ error: error.message }).code(400);
    }
  },
};

async function liked(request, h, booleans) {
  const token = request.headers.authorization.split(" ")[1];
  const { idPost } = request.params;
  try {
    const userId = await jwt.verify(token, secretKey, async (err, decoded) => {
      const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
      if (err) {
        throw new Error("Invalid token");
      }
      return decoded.user_id;
    });
    const role = await Users.getRole(userId);
    const [result, error] = await Posts.liked({
      user_id: userId,
      id_post: idPost,
      liked: booleans,
    });
    if (error) {
      throw error;
    }
    return h.response({ message: "Token verified", role, result }).code(200);
  } catch (error) {
    if (error.message == "Unauthorized") {
      return h.response({ error: error.message }).code(401);
    }
    return h.response({ error: error.message }).code(400);
  }
}
