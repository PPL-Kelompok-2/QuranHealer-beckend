import Hapi from "@hapi/hapi";
import users from "./routes/user.js";

const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: "localhost",
  });

  server.route([...users]);

  await server.start();
  console.log("server berjalan");
};

init();
