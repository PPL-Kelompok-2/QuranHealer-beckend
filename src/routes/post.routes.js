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
    method: "POST",
    path: "/post",
    handler: postController.addPost,
  },
  {
    method: "GET",
    path: "/post/{idPost}/like",
    handler: postController.like,
  },
  {
    method: "GET",
    path: "/post/{idPost}/dislike",
    handler: postController.dislike,
  },
  {
    method: "GET",
    path: "/user/post",
    handler: postController.userPost,
  },
];
