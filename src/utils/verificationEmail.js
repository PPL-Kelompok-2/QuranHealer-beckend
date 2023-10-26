import generateRandom from "./generateRandom.js";
import sendEmail from "./sendEmail.js";
import cache from "memory-cache";
import dotenv from "dotenv";
import templateVerificationEmail from "../../views/templateVerificationEmail.js";
import config from "../../config.js";
dotenv.config({ path: "../.env" });

const Verification = new sendEmail(config.email, process.env.PASSING);
Verification.subjek = templateVerificationEmail.subject;

async function verificationEmail(receiver) {
  const randomNum = generateRandom(4).toUpperCase();
  await cache.put(receiver, randomNum, 3600000);
  Verification.contentMail = templateVerificationEmail.content(randomNum);
  await Verification.sendMail(receiver);
  return "Code verifikasi berhasil dikirim";
}

export default verificationEmail;
