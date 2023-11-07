import { Users } from "../../model/Data.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userValidation from "../middleware/userValidation.js";
dotenv.config();

const secretKey = process.env.SECRETKEY;
const secretKeyRefresh = process.env.SECRETKEY_REFRESH;

const userController = {
    async register(request, h){
        try{
            const dataInput = await userValidation.register(request)
            const result = await Users.addData(dataInput);
            return h.response({result}).code(200)
        }catch(err){
            return h.response({
                error: err.message
            }).code(400)
        }
    },
    async login(request, h){
        try{
            const dataInput = await userValidation.login(request)
            const data = await Users.login(dataInput.email, dataInput.password)
            return h.response({
                refreshToken: jwt.sign({user_id : data.user_id}, secretKeyRefresh, {
                    expiresIn: process.env.EXPIRES_TOKEN_REFRESH
                  }),
                  accessToken: jwt.sign(data, secretKey, {
                    expiresIn: process.env.EXPIRES_TOKEN,
                  }),
            }).code(200)
        }catch(err){
            return h.response({
                error: err.message
            }).code(400)
        }
    },
    async getUser(request, h){
        try{
            const token = request.headers.authorization.split(" ")[1]; // Extract the token
            const result = await jwt.verify(token, secretKey, async (err, decoded)=>{
                if(err){
                    throw new Error('Invalid token')
                }
                const data = await Users.getData(decoded.user_id);
                const { name, email, email_verif, gender } = data;
                return {
                name,
                email,
                email_verif,
                gender,
                };
            })
            return h.response({
                message: "Token verified",
                result
            }).code(200)
        }catch(err){
            return h.response({
                error: err.message
            }).code(400)
        }
    },
    async newToken(request, h){
        try{
            const token = request.headers.authorization.split(" ")[1];
            const result = await jwt.verify(token, secretKeyRefresh, async (err, decoded)=>{
              if(err){
                throw new Error('token salah')
              }
              const data = await Users.getData(decoded.user_id);
              return jwt.sign(data, secretKey, {
                  expiresIn: process.env.EXPIRES_TOKEN
                })
              
            })
            return h.response({message : "Token verified", accessToken: result}).code(200)
          }catch(err){
            return h.response({error: err}).code(400)
          }
    },
    // dibawah belum dirapikan
    async getUserId(request, h){
        const token = request.headers.authorization.split(" ")[1]; // Extract the token
      const { id } = request.params;

      // Verify the token
      return jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          return { error: "Invalid token" };
        }
        const [dataUser] = await Users.getData(id)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            throw err;
          });
        const { name, role } = dataUser;
        const result = {
          name,
          role,
        };
        return { message: "Token verified", result };
      });
    }, 
    async userEdit(request, h){
        const token = request.headers.authorization.split(" ")[1]; // Extract the token
      const dataUbah = JSON.parse(request.payload);
      // Verify the token
      return jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          return { error: "Invalid token" };
        }
        const data = await Users.updateData(decoded.user_id, dataUbah)
          .then((data) => {
            return data;
          })
          .catch((err) => {
            return err;
          });
        return { message: "Token verified", data };
      });
    },
    async passwordEdit(request, h){
        const token = request.headers.authorization.split(" ")[1]; // Extract the token
      const { oldPassword, newPassword } = JSON.parse(request.payload);
      // Verify the token
      return jwt.verify(token, secretKey, async (err, decoded) => {
        if (err) {
          return { error: "Invalid token" };
        }
        const data = await Users.gantiPassword(
          decoded.user_id,
          oldPassword,
          newPassword
        )
          .then((data) => {
            return data;
          })
          .catch((err) => {
            return { error: err.message };
          });
        return { message: "Token verified", data };
      });
    },
}

export default userController