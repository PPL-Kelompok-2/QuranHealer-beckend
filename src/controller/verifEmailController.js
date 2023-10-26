import jwt from "jsonwebtoken";
import cache from "memory-cache";
import { Users } from "../../model/Data.js";
import verificationEmail from "../utils/verificationEmail.js";
import { codeCheck } from "../utils/codeCheck.js";

const secretKey = process.env.SECRETKEY;

const verifEmailController = {
    async verif(request, h) {
        const token = request.headers.authorization.split(" ")[1]; // Extract the token
        try{
            const dataUser = await jwt.verif(token, secretKey, async (err, decoded)=>{
                if (err){
                    throw new Error("Invelid token")
                }
                return decoded
            })
            const [getUser] = await Users.getData(dataUser.user_id)
            const result = await verificationEmail(getUser.email)
            return h.response({result}).code(200)
        }catch(err){
            return h
                .response({
                    error: err.message,
                })
                .code(400);
        }
        // Verify the token
        return jwt.verify(token, secretKey, async (err, decoded) => {
          if (err) {
            return { error: "Invalid token" };
          }
          const [getUser] = await Users.getData(decoded.user_id)
            .then((data) => {
              return data;
            })
            .catch((err) => {
              return err;
            });
          const result = await verificationEmail(getUser.email)
            .then((data) => {
              return data;
            })
            .catch((err) => {
              return err;
            });
          return { message: "Token verified", result };
        });}
}

export default verifEmailController;