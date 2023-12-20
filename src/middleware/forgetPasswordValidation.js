import Joi from "joi";
import isJson from "../utils/isJSON.js";

const forgetPasswordValidation = {
  forget(request) {
    return new Promise((resolve, reject) => {
      const schema = Joi.object({
        email: Joi.string().min(1).max(50).required(),
      });
      try {
        const { error, value } = schema.validate(JSON.parse(request.payload));
        if (error) {
          reject(error);
        }
        resolve(value);
      } catch (err) {
        const { error, value } = schema.validate(request.payload);
        if (error) {
          reject(error);
        }
        resolve(value);
      }
    });
  },
  newPassword(request) {
    return new Promise((resolve, reject) => {
      const schema = Joi.object({
        newPassword: Joi.string().min(1).max(50).required(),
      });
      try {
        const { error, value } = schema.validate(JSON.parse(request.payload));
        if (error) {
          reject(error);
        }
        resolve(value);
      } catch (err) {
        const { error, value } = schema.validate(request.payload);
        if (error) {
          reject(error);
        }
        resolve(value);
      }
    });
  },
};

export default forgetPasswordValidation;
