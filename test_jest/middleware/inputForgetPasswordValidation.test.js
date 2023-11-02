import inputForgetPasswordValidation from "../../src/middleware/inputForgetPasswordValidator";

describe("inputForgetPasswordValidation, middleware, function forget", () => {
  test("mengembalikan error karena bukan JSON", () => {
    const bukanJsonData = {
      payload: {
        email: "fftypz@gmail.com",
      },
    };
    inputForgetPasswordValidation
      .forget(bukanJsonData)
      .then((data) => {
        expect(data).toBe(false);
      })
      .catch((err) => {
        expect(err).toHaveProperty("message");
      });
  });
  test("mengembalikan email karena data benar", () => {
    const jsonData = {
      payload: {
        email: "fftypz@gmail.com",
      },
    };
    jsonData.payload = JSON.stringify(jsonData.payload);
    inputForgetPasswordValidation
      .forget(jsonData)
      .then((data) => {
        expect(data.email).toBe("fftypz@gmail.com");
      })
      .catch((err) => {
        expect(err).toBe(false);
      });
  });
  test("mengembalikan data salah karena email tidak ada", () => {
    const jsonData = {
      payload: {
        name: "fftypz@gmail.com",
      },
    };
    jsonData.payload = JSON.stringify(jsonData.payload);
    inputForgetPasswordValidation
      .forget(jsonData)
      .then((data) => {
        expect(data.email).toBe(false);
      })
      .catch((err) => {
        expect(err).toHaveProperty("message");
      });
  });
});

describe("inputForgetPasswordValidation, middleware, function newPassword", () => {
  test("mengembalikan error karena bukan JSON", () => {
    const bukanJsonData = {
      payload: {
        newPassword: "12345",
      },
    };
    inputForgetPasswordValidation
      .newPassword(bukanJsonData)
      .then((data) => {
        expect(data).toBe(false);
      })
      .catch((err) => {
        expect(err).toHaveProperty("message");
      });
  });
  test("mengembalikan newPassword karena data benar", () => {
    const jsonData = {
      payload: {
        newPassword: "123456789",
      },
    };
    jsonData.payload = JSON.stringify(jsonData.payload);
    inputForgetPasswordValidation
      .newPassword(jsonData)
      .then((data) => {
        expect(data.newPassword).toBe("123456789");
      })
      .catch((err) => {
        expect(err).toBe(false);
      });
  });
  test("mengembalikan error karena property newPassword tidak ada", () => {
    const jsonData = {
      payload: {
        name: "fftypz@gmail.com",
      },
    };
    jsonData.payload = JSON.stringify(jsonData.payload);
    inputForgetPasswordValidation
      .newPassword(jsonData)
      .then((data) => {
        expect(data.newPassword).toBe(false);
      })
      .catch((err) => {
        expect(err).toHaveProperty("message");
      });
  });
});
