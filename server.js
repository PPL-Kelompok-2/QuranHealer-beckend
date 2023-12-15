import Hapi from "@hapi/hapi";
import users from "./src/routes/user.js";
import verifEmail from "./src/routes/verifEmail.js";
import forgetPassword from "./src/routes/forgetPassword.js";
import config from "./config.js";
import homepage from "./src/routes/homepage.js";
import favicon from "./src/routes/favicon.js";
import { post } from "./src/routes/post.routes.js";

const init = async () => {
  const server = Hapi.server({
    port: config.port,
    host: config.host,
  });

  server.route([
    ...homepage,
    ...users,
    ...verifEmail,
    ...forgetPassword,
    ...favicon,
    ...post,
  ]);

  await server.start();
  console.log("server berjalan");
};

init();
