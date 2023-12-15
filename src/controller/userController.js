import { Users } from "../../model/Data.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userValidation from "../middleware/userValidation.js";
dotenv.config();

const secretKey = process.env.SECRETKEY;
const secretKeyRefresh = process.env.SECRETKEY_REFRESH;

const userController = {
  async register(request, h) {
    try {
      const dataInput = await userValidation.register(request);
      const result = await Users.addData(dataInput);
      return h.response({ result }).code(200);
    } catch (err) {
      return h
        .response({
          error: err.message,
        })
        .code(400);
    }
  },
  async login(request, h) {
    try {
      const dataInput = await userValidation.login(request);
      const data = await Users.login(dataInput.email, dataInput.password);
      const role = await Users.getRole(data.user_id);
      return h
        .response({
          role,
          refreshToken: jwt.sign({ user_id: data.user_id }, secretKeyRefresh, {
            expiresIn: process.env.EXPIRES_TOKEN_REFRESH,
          }),
          accessToken: jwt.sign(data, secretKey, {
            expiresIn: process.env.EXPIRES_TOKEN,
          }),
        })
        .code(200);
    } catch (err) {
      return h
        .response({
          error: err.message,
        })
        .code(400);
    }
  },
  async getUser(request, h) {
    try {
      const token = request.headers.authorization.split(" ")[1]; // Extract the token
      const result = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          if (err) {
            throw new Error("Invalid token");
          }
          const data = await Users.getData(decoded.user_id);
          const { name, role, email, email_verif, gender } = data;
          return {
            name,
            role,
            email,
            email_verif,
            gender,
          };
        }
      );
      return h
        .response({
          message: "Token verified",
          result,
        })
        .code(200);
    } catch (err) {
      return h
        .response({
          error: err.message,
        })
        .code(400);
    }
  },
  async newToken(request, h) {
    try {
      const token = request.headers.authorization.split(" ")[1];
      const result = await jwt.verify(
        token,
        secretKeyRefresh,
        async (err, decoded) => {
          if (err) {
            throw new Error("token salah");
          }
          const data = await Users.getData(decoded.user_id);
          return jwt.sign(data, secretKey, {
            expiresIn: process.env.EXPIRES_TOKEN,
          });
        }
      );
      return h
        .response({ message: "Token verified", accessToken: result })
        .code(200);
    } catch (err) {
      return h.response({ error: err.message }).code(400);
    }
  },
  async getUserId(request, h) {
    try {
      const token = request.headers.authorization.split(" ")[1]; // Extract the token
      const { id } = request.params;
      // Verify token
      await jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return { error: "Invalid token" };
        }
      });
      const dataUser = await Users.getData(id);
      const { name, role } = dataUser;
      const result = {
        name,
        role,
      };
      return h
        .response({
          message: "Token verified",
          result,
        })
        .code(200);
    } catch (err) {
      return h
        .response({
          error: err.message,
        })
        .code(400);
    }
  },
  async userEdit(request, h) {
    try {
      const token = request.headers.authorization.split(" ")[1]; // Extract the token
      const dataInput = await userValidation.userEdit(request);
      const result = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          if (err) {
            throw new Error("Invalid token");
          }
          const data = await Users.updateData(decoded.user_id, dataInput);
          return data;
        }
      );
      return h
        .response({
          message: "Token verified",
          result,
        })
        .code(200);
    } catch (err) {
      return h
        .response({
          error: err.message,
        })
        .code(400);
    }
  },
  async passwordEdit(request, h) {
    try {
      const token = request.headers.authorization.split(" ")[1]; // Extract the token
      const { oldPassword, newPassword } = await userValidation.password(
        request
      );
      const result = await jwt.verify(
        token,
        secretKey,
        async (err, decoded) => {
          if (err) {
            throw new Error("Invalid token");
          }
          const data = await Users.gantiPassword(
            decoded.user_id,
            oldPassword,
            newPassword
          );
          return data;
        }
      );
      return h
        .response({
          message: "Token verified",
          result,
        })
        .code(200);
    } catch (err) {
      console.log(err);
      return h
        .response({
          error: err.message,
        })
        .code(400);
    }
  },
};

export default userController;
