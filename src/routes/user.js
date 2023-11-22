import userController from "../controller/userController.js";
import userDevelopment from "../controller/userDevelopment.js";

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
  },
  //for development purposes and must be deleted after deployment
  {
    method: 'GET',
    path: '/allusers',
    handler: userDevelopment.allData
  },
  {
    method: 'GET',
    path: '/delete/{email}',
    handler: userDevelopment.deleteData
  }
];

export default users;
