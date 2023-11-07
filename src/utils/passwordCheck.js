async function passwordCheck(id, passwordOld, pool) {
  const result = await pool.query(`SELECT * FROM USERS WHERE user_id = $1`, [
    id,
  ]);
  if (result.rows.length == 0) {
    return false;
  }
  if (passwordOld == result.rows[0].password) {
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
