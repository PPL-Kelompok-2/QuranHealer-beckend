import { Users } from "../database/Data.js";
import jwt from "jsonwebtoken";

const secretKey = process.env.SECRETKEY;

const users = [
  {
    method: "POST",
    path: "/register",
    handler: async (request, h) => {
      let result;
      try {
        const requestUser = JSON.parse(request.payload);
        await Users.addData(requestUser)
          .then((data) => {
            const returnData = {
              message: `data berhasil ditambahkan dengan id ${data}`,
            };
            result = h.response(returnData).code(200);
          })

          .catch((err) => {
            throw err;
          });
      } catch (err) {
        const response = {
          message: err.message,
        };
        result = h.response(response).code(400);
      }

      return result;
    },
  },
  {
    method: "POST",
    path: "/login",
    handler: async (request, h) => {
      const data = JSON.parse(request.payload);
      let result;
      try {
        const { email, password } = data;
        if (email && password) {
          const [dataUser] = await Users.login(email, password)
            .then((data) => {
              return data;
            })
            .catch((err) => {
              throw err;
            });
          result = {
            token: jwt.sign(dataUser, secretKey, { expiresIn: "1h" }),
          };
        } else {
          throw new Error("data yang dimasukkan salah");
        }
      } catch (err) {
        const resultError = {
          message: err.message,
        };
        result = resultError;
      }

      return h.response(result);
    },
  },
  {
    method: "GET",
    path: "/user",
    handler: (request, h) => {
      const token = request.headers.authorization.split(" ")[1]; // Extract the token

      // Verify the token
      return jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          return { error: "Invalid token" };
        }
        const [dataUser] = await Users.getData(decoded.user_id)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            throw err;
          });
        const { name, email, email_verif, password, telp, gender } = dataUser;
        const result = {
          name,
          email,
          email_verif,
          password,
          telp,
          gender,
        };
        return { message: "Token verified", result };
      });
    },
  },
  {
    method: "PUT",
    path: "/user/edit",
    handler: (request, h) => {
      const token = request.headers.authorization.split(" ")[1]; // Extract the token
      const dataUbah = JSON.parse(request.payload);
      // Verify the token
      return jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          return { error: "Invalid token" };
        }
        const data = await Users.updateData(decoded.user_id, dataUbah)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            return err;
          });
        return { message: "Token verified", data };
      });
    },
  },
];

export default users;
