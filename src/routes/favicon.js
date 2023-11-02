import Path from "path";

const favicon = {
  method: "GET",
  path: "/favicon.ico",
  handler: async (request, h) => {
    return await h.file(Path.join(__dirname, "./favicon.ico"));
  },
};

export default favicon;
