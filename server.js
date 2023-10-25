import Hapi from "@hapi/hapi";
import users from "./src/routes/user.js";
import verifEmail from "./src/routes/verifEmail.js";
import forgetPassword from "./src/routes/forgetPassword.js";

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
  });

  server.route([...users, ...verifEmail, ...forgetPassword]);

  await server.start();
  console.log("server berjalan");
};

init();
