import { passwordCheck, passwordKosong } from "../utils/passwordCheck";
import mysql from "mysql2";

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

describe("password check utils", () => {
  test("password check is the users have the same password, return true", async () => {
    try {
      const result = await passwordCheck(27, "1234", pool);
      expect(result).toBe(true);
    } catch (err) {
      console.log(err);
      expect(true).toBe(false);
    }
  });
  test("password check is the users not have the same password, return false", async () => {
    try {
      const result = await passwordCheck(27, "12345", pool);
      expect(result).toBe(false);
    } catch (err) {
      console.log(err);
      expect(false).toBe(true);
    }
  });
  test("password check is the users is in the database, return false", async () => {
    try {
      const result = await passwordCheck(1, "1234", pool);
      expect(result).toBe(false);
    } catch (err) {
      console.log(err);
      expect(false).toBe(true);
    }
  });
});

describe("password kosong", () => {
  test("seharusnya menembalikan error", () => {
    expect(() => passwordKosong("1234", "")).toThrow("password kosong");
  });
  test("seharusnya menembalikan error", () => {
    expect(() => passwordKosong("1234", "123")).not.toThrow("password kosong");
  });
});
