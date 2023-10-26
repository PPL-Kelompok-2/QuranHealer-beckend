import Hapi from "@hapi/hapi";
import users from "./src/routes/user.js";
import verifEmail from "./src/routes/verifEmail.js";
import forgetPassword from "./src/routes/forgetPassword.js";
import config from "./config.js";

const init = async () => {
  const server = Hapi.server({
    port: config.port,
    host: config.host,
  });

  server.route([...users, ...verifEmail, ...forgetPassword]);

  await server.start();
  console.log("server berjalan");
};

init();
