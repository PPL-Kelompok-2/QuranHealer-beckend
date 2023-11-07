import userController from "../controller/userController.js";

const users = [
  {
    method: "POST",
    path: "/register",
    handler: userController.register
  },
  {
    method: "POST",
    path: "/login",
    handler: userController.login
  },
  {
    method: "GET",
    path: "/user",
    handler: userController.getUser
  },
  {
    method: "GET",
    path: "/user/{id}",
    handler: userController.getUserId
  },
  {
    method: "PUT",
    path: "/user/edit",
    handler: userController.userEdit
  },
  {
    method: "PUT",
    path: "/user/password",
    handler: userController.passwordEdit
  },
  {
    method: 'GET',
    path:'/token',
    handler: userController.newToken
  }
];

export default users;
