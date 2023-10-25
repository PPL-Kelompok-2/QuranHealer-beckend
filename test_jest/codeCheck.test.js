import { codeCheck, codeCheckBiasa } from "../utils/codeCheck";

describe("codeCheckBiasa utils", () => {
  test("mengembalikan true karena code sama", () => {
    expect(codeCheckBiasa("asdw", "asdw")).toBe(true);
  });
  test("mengembalikan false karena code tidak sama", () => {
    expect(codeCheckBiasa("asdw", "asd")).toBe(false);
  });
});

describe("codeCheck Utils", () => {
  test("mengembalikan user verifikasi jika code sama", async () => {
    expect(await codeCheck("asdw", "asdw", 27)).toEqual(
      "Data berhasil diverifikasi"
    );
  });
});
