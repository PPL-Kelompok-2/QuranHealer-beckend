import cache from "memory-cache";
import forgetPasswordController from "../../src/controller/forgetPasswordController";
import h from "./hresponse";

const response = {
  payload: {
    email: "quranhealer@gmail.com",
  },
};

describe("forget password controller, controller, function forget", () => {
  test("menghasilkan return berhasil untuk mengirimkan email", async () => {
    try {
      response.payload = JSON.stringify(response.payload);
      const result = await forgetPasswordController.forget(h, response);
      expect(result.code).toBe(200);
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });
});

describe("forget password controller, controller, function forget password",()=>{
  test("menghasilkan return 'token' dengan 'code' yang sama", async () => {
    response.code = cache.get(response.payload.email);
    response.payload = JSON.stringify(response.payload);

    try {
      const result = await forgetPasswordController.forgetCode(h, response);
      // ini digunakan di test berikutnya
      response.headers.authorization = `token ${result.token}`;
      expect(result.code).toBe(200);
    } catch (err) {
      expect(err).toHaveProperty("message");
    }
  });
})

describe("forget password controller, controller, function newPassword", ()=>{
  test("menghasilkan return berhasil", async ()=>{
    response.payload = {
      newPassword:"12345"
    }
    response.payload = JSON.stringify(response.payload)
    try{
      const result = await forgetPasswordController.newPassord(h, response)
      response.headers.authorization = `token ${result.token}`;
      expect(result.code).toBe(200)
    }catch(err){
      expect(err).toHaveProperty("message")
    }
  })
})
