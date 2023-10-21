import nodemailer from "nodemailer";

class sendEmail {
  constructor(sender, password) {
    this.sender = sender;
    this.password = password;
    this.transporter = nodemailer.createTransport({
      service: "Gmail", // Gunakan penyedia email Anda
      auth: {
        user: this.sender,
        pass: this.password,
      },
    });
  }

  set subjek(subj) {
    this.subjeks = subj;
  }

  set contentMail(contentMail) {
    this.contentMails = contentMail;
  }

  sendMail(receiver) {
    this.mailOptions = {
      from: this.sender,
      to: receiver,
      subject: this.subjeks,
      html: this.contentMails,
    };
    this.transporter.sendMail(this.mailOptions, (error, info) => {
      if (error) {
        throw new Error("email tidak terkirim" + error);
      } else {
        return "Email terkirim: ";
      }
    });
  }
}

// const sending = new sendEmail(process.env.EMAIL, process.env.PASSING);
// sending.subjek = "test";
// sending.contentMail = "hallo ini akbar";
// sending.sendMail("fftypz@gmail.com");
// // sending
// //   .sendMail("fftypz@gmail.com")
// //   .then((data) => {
// //     console.log(data);
// //   })
// //   .catch((err) => {
// //     console.log(err);
// //   });

export default sendEmail;
