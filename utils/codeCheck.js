import { Users } from "../database/Data.js";

async function codeCheck(code1, code2, id) {
  if (code1 == code2) {
    const data = await Users.verifEmail(id)
      .then((data) => {
        return data;
      })
      .catch((err) => {
        return err;
      });
    return data;
  }
  throw new Error("Code salah");
}

export default codeCheck;
