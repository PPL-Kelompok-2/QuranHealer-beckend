import forgetPasswordController from "../controller/forgetPasswordController.js";

const forgetPassword = [
  {
    method: "POST",
    path: "/forget",
    handler: forgetPasswordController.forget,
  },
  {
    method: "GET",
    path: "/forget/{code}",
    handler: forgetPasswordController.forgetCode,
  },
  {
    method: "POST",
    path: "/forget/password",
    handler: forgetPasswordController.newPassord,
  },
];

export default forgetPassword;
