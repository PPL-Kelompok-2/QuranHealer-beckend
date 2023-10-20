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
        console.log(requestUser);
        await Users.addData(requestUser)
          .then((data) => {
            console.log(data);
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
    handler: (request, h) => {
      const user = { id: 1, username: "john_doe" };

      const token = jwt.sign(user, secretKey, { expiresIn: "1d" });

      return JSON.stringify(token);
    },
  },
  {
    method: "GET",
    path: "/protected",
    handler: (request, h) => {
      const token = request.headers.authorization.split(" ")[1]; // Extract the token

      // Verify the token
      return jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
          return { error: "Invalid token" };
        }
        return { message: "Token verified", decoded };
      });
    },
  },
];

export default users;
