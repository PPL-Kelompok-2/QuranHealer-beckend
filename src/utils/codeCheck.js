import { Users } from "../../model/Data.js";

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

function codeCheckBiasa(code1, code2) {
  if (code1 == code2) {
    return true;
  }
  return false;
}

export { codeCheck, codeCheckBiasa };
