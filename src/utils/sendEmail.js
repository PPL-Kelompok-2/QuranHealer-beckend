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

  async sendMail(receiver) {
    this.mailOptions = {
      from: this.sender,
      to: receiver,
      subject: this.subjeks,
      html: this.contentMails,
    };

    try {
      const info = await this.transporter.sendMail(this.mailOptions);
      return "Email terkirim: " + info.response;
    } catch (error) {
      throw new Error("email tidak terkirim" + error);
    }
  }
}

export default sendEmail;
