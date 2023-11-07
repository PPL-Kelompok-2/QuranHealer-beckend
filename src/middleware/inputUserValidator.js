import Joi from "joi";
import isJson from "../utils/isJSON.js";

const inputUserValidator = {
    register(request){
        return new Promise((resolve, reject)=>{
            if (!isJson(request.payload)) {
                reject(new Error("data yang dikirim bukan json"));
              }
              const schema = Joi.object({
                name: Joi.string().max(50).min(1).required(),
                email: Joi.string().email().max(50).min(3).required(),
                password: Joi.string().max(50).min(1).required(),
                gender: Joi.string().min(1).max(1).valid('L','P').required()
              })
              const {error, value} = schema.validate(JSON.parse(request.payload))
              if (error) {
                reject(error);
              }
              resolve(value);
        })
    }
}


export default inputUserValidator