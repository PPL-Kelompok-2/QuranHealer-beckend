import generateRandom from "./generateRandom.js";
import sendEmail from "./sendEmail.js";
import cache from "memory-cache";
import dotenv from "dotenv";
import templateForgetEmail from "../../views/templateForgetEmail.js";
import config from "../../config.js";
dotenv.config({ path: "../.env" });

const Verification = new sendEmail(config.email, process.env.PASSING);
Verification.subjek = templateForgetEmail.subject;

async function forgetEmail(receiver) {
  const randomNum = generateRandom(4).toUpperCase();
  cache.put(receiver, randomNum, 3600000);
  Verification.contentMail = templateForgetEmail.content(randomNum);
  await Verification.sendMail(receiver);
  return "Code verifikasi berhasil dikirim";
}

export default forgetEmail;
