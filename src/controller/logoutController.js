import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Logouts } from "../../model/Data.js";
dotenv.config();

export const logoutController = {
  async logout(request, h) {
    const token = request.headers.authorization.split(" ")[1];
    try {
      const idUser = await jwt.verify(
        token,
        process.env.SECRETKEY,
        (err, decoded) => {
          if (err) {
            throw new Error("Invalid token");
          }
          return decoded.user_id;
        }
      );
      const [result, error] = await Logouts.doLogout(idUser, token);
      if (error) {
        throw error;
      }
      return h.response({
        result: "Berhasil Logout",
      });
    } catch (error) {
      return h.response({
        error: error.message,
      });
      // .code(400)
    }
  },
};
