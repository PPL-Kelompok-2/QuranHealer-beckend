import jwt from "jsonwebtoken";
import cache from "memory-cache";
import { Users } from "../../model/Data.js";
import { codeCheckBiasa } from "../utils/codeCheck.js";
import forgetEmail from "../utils/forgetEmail.js";
import dotenv from "dotenv";
import inputForgetPasswordValidation from "../middleware/inputForgetPasswordValidator.js";
dotenv.config({ path: "../.env" });

const secretKey = process.env.SECRETKEY;

const forgetPasswordController = {
  async forget(request, h) {
    try {
      const value = await inputForgetPasswordValidation.forget(request);
      const [data] = await Users.emailAda(value.email);
      console.log(data);
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
    const { email } = JSON.parse(request.payload);
    const { code } = request.params;
    if (!email) {
      return { message: "data yang dimasukkan salah atau kosong" };
    }

    let result;
    try {
      const [data] = await Users.emailAda(email)
        .then((data) => {
          return data;
        })
        .catch((err) => {
          throw err;
        });
      if (codeCheckBiasa(code.toUpperCase(), cache.get(email))) {
        const token = jwt.sign({ email: data.email }, secretKey, {
          expiresIn: process.env.EXPIRES_TOKEN_SEMENTARA,
        });
        result = { token };
      } else {
        throw new Error("kode forget password salah");
      }
    } catch (err) {
      result = {
        message: err.message,
      };
    }

    return h.response(result);
  },
  async newPassord(request, h) {
    const token = request.headers.authorization.split(" ")[1];
    const { newPassword } = JSON.parse(request.payload);

    if (!newPassword) {
      return {
        message: "password kosong",
      };
    }
    console.log(token, secretKey);

    return jwt.verify(token, secretKey, async (err, decoded) => {
      if (err) {
        return { error: "Invalid token" };
      }
      const result = await Users.gantiPasswordEmail(decoded.email, newPassword)
        .then((data) => {
          return data;
        })
        .catch((err) => {
          return err;
        });
      console.log("diatas yang salah");
      return { message: "Token verified", result };
    });
  },
};

export default forgetPasswordController;
