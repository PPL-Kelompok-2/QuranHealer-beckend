import jwt from "jsonwebtoken";
import cache from "memory-cache";
import { Users } from "../../model/Data.js";
import { codeCheckBiasa } from "../utils/codeCheck.js";
import forgetEmail from "../utils/forgetEmail.js";
import dotenv from "dotenv";
import inputForgetPasswordValidation from "../middleware/inputForgetPasswordValidator.js";
import config from "../../config.js";
dotenv.config({ path: "../.env" });

const secretKey = process.env.SECRETKEY;

const forgetPasswordController = {
  async forget(request, h) {
    try {
      const { email } = await inputForgetPasswordValidation.forget(request);
      const [data] = await Users.emailAda(email);
      const result = await forgetEmail(data.email);
      return h.response({ result }).code(200);
    } catch (err) {
      console.log(err);
      return h
        .response({
          error: err.message,
        })
        .code(400);
    }
  },
  async forgetCode(request, h) {
    try {
      const { email } = await inputForgetPasswordValidation.forget(request);
      const { code } = request.params;
      const [data] = await Users.emailAda(email);
      if (!codeCheckBiasa(code.toUpperCase(), cache.get(email))) {
        throw new Error("kode forget password salah");
      }
      const token = jwt.sign({ email: data.email }, secretKey, {
        expiresIn: config.expires_token,
      });
      return h.response({ token }).code(200);
    } catch (err) {
      return h
        .response({
          error: err.message,
        })
        .code(400);
    }
  },
  async newPassord(request, h) {
    try {
      const token = request.headers.authorization.split(" ")[1];
      const { newPassword } = await inputForgetPasswordValidation.newPassword(
        request
      );
      const hasil = await jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          throw new Error("invalid token");
        }
        const result = await Users.gantiPasswordEmail(
          decoded.email,
          newPassword
        );
        return { message: "Token verified", result };
      });
      return h.response(hasil).code(200);
    } catch (err) {
      return h
        .response({
          error: err.message,
        })
        .code(400);
    }
  },
};

export default forgetPasswordController;
