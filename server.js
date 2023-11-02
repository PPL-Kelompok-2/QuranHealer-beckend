import Hapi from "@hapi/hapi";
import Favicon from "hapi-favicon";
import users from "./src/routes/user.js";
import verifEmail from "./src/routes/verifEmail.js";
import forgetPassword from "./src/routes/forgetPassword.js";
import config from "./config.js";
import homepage from "./src/routes/homepage.js";

const init = async () => {
  const server = Hapi.server({
    port: config.port,
    host: config.host,
  });

  server.route([...homepage, ...users, ...verifEmail, ...forgetPassword]);

  await server.register({
    plugin: Favicon,
    options: {
      path: "./favicon.ico", // Lokasi berkas favicon.ico
    },
  });

  await server.start();
  console.log("server berjalan");
};

init();
