import { postController } from "../controller/post.controller.js";

export const post = [
  {
    method: "GET",
    path: "/post/{idPost}",
    handler: postController.getPost,
  },
  {
    method: "GET",
    path: "/post",
    handler: postController.post,
  },
  {
    method: "GET",
    path: "/user/post",
    handler: postController.userPost,
  },
];
