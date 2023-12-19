import jwt from "jsonwebtoken";
import cache from "memory-cache";
import { Logouts, Users } from "../../model/Data.js";
import { codeCheckBiasa } from "../utils/codeCheck.js";
import forgetEmail from "../utils/forgetEmail.js";
import dotenv from "dotenv";
import forgetPasswordValidation from "../middleware/forgetPasswordValidation.js";
import config from "../../config.js";
dotenv.config({ path: "../.env" });

const secretKey = process.env.SECRETKEY;

const forgetPasswordController = {
  async forget(request, h) {
    try {
      const { email } = await forgetPasswordValidation.forget(request);
      const [data] = await Users.emailAda(email);
      const result = await forgetEmail(data.email);
      return h.response({ result }).code(200);
    } catch (err) {
      console.error(err)
      return h
        .response({
          error: err.message,
        })
        .code(400);
    }
  },
  async forgetCode(request, h) {
    try {
      const { email } = await forgetPasswordValidation.forget(request);
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
      const { newPassword } = await forgetPasswordValidation.newPassword(
        request
      );
      const hasil = await jwt.verify(token, secretKey, async (err, decoded) => {
        const [rest, error] = await Logouts.cekTokenLogout(token)
        if(error){throw error}
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
