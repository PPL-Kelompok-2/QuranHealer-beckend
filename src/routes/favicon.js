import Path from "path";

const favicon = {
  method: "GET",
  path: "/favicon.ico",
  handler: (request, h) => {
    return h.file(Path.join(__dirname, "favicon.ico"));
  },
};

export default favicon;
