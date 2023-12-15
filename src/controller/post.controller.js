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
      return h.response({ result }).code(200);
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
};

async function liked(request, h, booleans) {
  const token = request.headers.authorization.split(" ")[1];
  const { idPost } = request.params;
  try {
    const userId = await jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        throw new Error("Invalid token");
      }
      return decoded.user_id;
    });
    const role = await Users.getRole(userId);
    if (!(role == "user")) {
      throw new Error("Unauthorized");
    }
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
