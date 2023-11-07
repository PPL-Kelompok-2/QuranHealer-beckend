import Joi from "joi";
import isJson from "../utils/isJSON.js";

const forgetPasswordValidation = {
  forget(request) {
    return new Promise((resolve, reject) => {
      if (!isJson(request.payload)) {
        reject(new Error("data yang dikirim bukan json"));
      }
      const schema = Joi.object({
        email: Joi.string().min(1).max(50).required(),
      });
      const { error, value } = schema.validate(JSON.parse(request.payload));
      if (error) {
        reject(error);
      }
      resolve(value);
    });
  },
  newPassword(request) {
    return new Promise((resolve, reject) => {
      if (!isJson(request.payload)) {
        reject(new Error("data yang dikirim bukan json"));
      }
      const schema = Joi.object({
        newPassword: Joi.string().min(1).max(50).required(),
      });
      const { error, value } = schema.validate(JSON.parse(request.payload));
      if (error) {
        reject(error);
      }
      resolve(value);
    });
  },
};

export default forgetPasswordValidation;
