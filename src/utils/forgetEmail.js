import generateRandom from "./generateRandom.js";
import sendEmail from "./sendEmail.js";
import cache from "memory-cache";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const Verification = new sendEmail(process.env.EMAIL, process.env.PASSING);
Verification.subjek = "FORGOT PASSWORD CODE FROM QURAN HEALER";

async function forgetEmail(receiver) {
  const randomNum = generateRandom(4).toUpperCase();
  cache.put(receiver, randomNum, 3600000);
  Verification.contentMail = `
    <center><h2>DON'T SHARE THIS CODE BELLOW</h2></center>
    <h3>this code is for forget password from quran healer application</h3>
    <center><h1><u><b>${randomNum}</b></u></h1></center>
    <h3>If you are not suppose to get this email please ignore this email...</h3>
`;
  await Verification.sendMail(receiver);
  return "Code verifikasi berhasil dikirim";
}

export default forgetEmail;
