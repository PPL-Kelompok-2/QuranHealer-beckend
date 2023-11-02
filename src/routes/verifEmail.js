import jwt from "jsonwebtoken";
import cache from "memory-cache";
import { Users } from "../../model/Data.js";
import verificationEmail from "../utils/verificationEmail.js";
import { codeCheck } from "../utils/codeCheck.js";
import verifEmailController from "../controller/verifEmailController.js";

const secretKey = process.env.SECRETKEY;

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
