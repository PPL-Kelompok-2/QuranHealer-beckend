import Joi from "joi";
import isJson from "../utils/isJSON.js";

export const postValidation = {
  addPost(request) {
    return new Promise((resolve, reject) => {
      if (!isJson(request.payload)) {
        reject(new Error("data yang dikirim bukan json"));
      }
      const schema = Joi.object({
        username: Joi.string().max(50).min(1).required(),
        judul: Joi.string().max(100).min(1).required(),
        konten: Joi.string().min(1).required(),
      });
      const { error, value } = schema.validate(JSON.parse(request.payload));
      if (error) {
        reject(error);
      }
      resolve(value);
    });
  },
  editPost(request) {
    return new Promise((resolve, reject) => {
      if (!isJson(request.payload)) {
        reject(new Error("data yang dikirim bukan json"));
      }
      const schema = Joi.object({
        username: Joi.string().max(50).min(1),
        judul: Joi.string().max(100).min(1),
        konten: Joi.string().min(1),
      });
      const { error, value } = schema.validate(JSON.parse(request.payload));
      if (error) {
        reject(error);
      }
      resolve(value);
    });
  },
  addComment(request) {
    return new Promise((resolve, reject) => {
      if (!isJson(request.payload)) {
        reject(new Error("data yang dikirim bukan json"));
      }
      const schema = Joi.object({
        comment: Joi.string().min(1).max(255).required(),
      });
      const { error, value } = schema.validate(JSON.parse(request.payload));
      if (error) {
        reject(error);
      }
      resolve(value);
    });
  },
};
