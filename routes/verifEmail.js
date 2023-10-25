// import jwt from "jsonwebtoken";
// import cache from "memory-cache";
// import { Users } from "../model/Data.js";
// import verificationEmail from "../utils/verificationEmail.js";
// import { codeCheck } from "../utils/codeCheck.js";

// const secretKey = process.env.SECRETKEY;

// const verifEmail = [
//   // mendapatkan codenya
//   {
//     method: "GET",
//     path: "/verif",
//     handler: (request, h) => {
//       const token = request.headers.authorization.split(" ")[1]; // Extract the token
//       // Verify the token
//       return jwt.verify(token, secretKey, async (err, decoded) => {
//         if (err) {
//           return { error: "Invalid token" };
//         }
//         const [getUser] = await Users.getData(decoded.user_id)
//           .then((data) => {
//             return data;
//           })
//           .catch((err) => {
//             return err;
//           });
//         const result = await verificationEmail(getUser.email)
//           .then((data) => {
//             return data;
//           })
//           .catch((err) => {
//             return err;
//           });
//         return { message: "Token verified", result };
//       });
//     },
//   },
//   {
//     method: "POST",
//     path: "/verif/{code}",
//     handler: (request, h) => {
//       const token = request.headers.authorization.split(" ")[1]; // Extract the token
//       const { code } = request.params;
//       // Verify the token
//       return jwt.verify(token, secretKey, async (err, decoded) => {
//         if (err) {
//           return { error: "Invalid token" };
//         }
//         const [getUser] = await Users.getData(decoded.user_id)
//           .then((data) => {
//             return data;
//           })
//           .catch((err) => {
//             return err;
//           });
//         const codeCache = cache.get(getUser.email);
//         const result = await codeCheck(
//           code.toUpperCase(),
//           codeCache,
//           getUser.user_id
//         )
//           .then((data) => {
//             return data;
//           })
//           .catch((err) => {
//             return err;
//           });
//         return { message: "Token verified", result };
//       });
//     },
//   },
// ];

// export default verifEmail;
