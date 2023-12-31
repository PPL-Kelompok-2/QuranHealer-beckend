import Joi from "joi";
import isJson from "../utils/isJSON.js";

const userValidation = {
  register(request) {
    return new Promise((resolve, reject) => {
      const schema = Joi.object({
        name: Joi.string().max(50).min(1).required(),
        email: Joi.string().email().max(50).min(3).required(),
        password: Joi.string().max(50).min(1).required(),
        gender: Joi.string().min(1).max(1).valid("L", "P").required(),
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
  login(request) {
    return new Promise((resolve, reject) => {
      const schema = Joi.object({
        email: Joi.string().email().max(50).min(3).required(),
        password: Joi.string().max(50).min(1).required(),
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
  userEdit(request) {
    return new Promise((resolve, reject) => {
      const schema = Joi.object({
        name: Joi.string().max(50).min(1),
        email: Joi.string().email().max(50).min(3),
        password: Joi.string().max(50).min(1),
        gender: Joi.string().min(1).max(1).valid("L", "P"),
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
  password(request) {
    return new Promise((resolve, reject) => {
      const schema = Joi.object({
        oldPassword: Joi.string().max(50).min(1).required(),
        newPassword: Joi.string().max(50).min(1).required(),
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

export default userValidation;
