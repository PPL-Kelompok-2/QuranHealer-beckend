import Hapi from "@hapi/hapi";
import users from "./routes/user.js";
import verifEmail from "./routes/verifEmail.js";
import forgetPassword from "./routes/forgetPassword.js";

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
