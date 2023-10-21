async function passwordCheck(id, passwordOld, pool) {
  const [result] = await pool.query(`SELECT * FROM USERS WHERE user_id = ?`, [
    id,
  ]);
  if (passwordOld == result[0].password) {
    return true;
  }
  return false;
}

function passwordKosong(password, password2) {
  if (!password || !password2) {
    throw new Error("password kosong");
  }
}

export { passwordCheck, passwordKosong };
