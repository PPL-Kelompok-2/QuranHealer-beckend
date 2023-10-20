const Hapi = require("@hapi/hapi");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
  });

  const secretKey = process.env.SECRETKEY;

  server.route([
    {
      method: "POST",
      path: "/login",
      handler: (request, h) => {
        const user = { id: 1, username: "john_doe" };

        const token = jwt.sign(user, secretKey, { expiresIn: "1h" });
        console.log(token);

        return { token };
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
  ]);

  await server.start();
  console.log("server berjalan");
};

init();
