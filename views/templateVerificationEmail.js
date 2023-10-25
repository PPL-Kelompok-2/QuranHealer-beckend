const templateVerificationEmail = {
  subject: `VERIFICATION EMAIL FROM QURAN HEALER`,
  content: (randomNum) => {
    return `
      <center><h2>DON'T SHARE THIS CODE BELLOW</h2></center>
      <h3>this code is for verification email to quran healer application</h3>
      <center><h1><u><b>${randomNum}</b></u></h1></center>
      <h3>If you are not suppose to get this email please ignore this email...</h3>
  `;
  },
};

export default templateVerificationEmail;
