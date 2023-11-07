import verifEmailController from "../controller/verifEmailController.js";

const verifEmail = [
  // mendapatkan codenya
  {
    method: "GET",
    path: "/verif",
    handler: verifEmailController.verif
  },
  {
    method: "POST",
    path: "/verif/{code}",
    handler: verifEmailController.verifCode
  },
];

export default verifEmail;
