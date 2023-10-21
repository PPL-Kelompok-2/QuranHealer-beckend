import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

class sendEmail {
  constructor(jenisMail) {
    this.transporter = nodemailer.createTransport({
      service: "Gmail", // Gunakan penyedia email Anda
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSING,
      },
    });
    this.mailOptions = {
      from: process.env.EMAIL,
      to: "akbar12ullah@gmail.com",
      subject: `${jenisMail}`,
      html: `<p>Klik <a href="/">di sini</a> untuk verifikasi email Anda.</p>`,
    };
  }

  sendMail() {
    this.transporter.sendMail(this.mailOptions, (error, info) => {
      if (error) {
        console.error("Email tidak dapat dikirim:", error);
      } else {
        console.log("Email terkirim:", info.response);
      }
    });
  }
}

const sending = new sendEmail("verifikasi email");
sending.sendMail();
