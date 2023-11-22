import {DDevelopment} from '../../model/Data.js'

const userDevelopment = {
    async allData(request, h){
        try{
            const datausers = await DDevelopment.getAllDataUsers();
            const result = datausers.sort((a, b)=>a.user_id - b.user_id)
            return h.response(
                {
                    result
                }
            ).code(200)
        }catch(err){
            console.error(err)
            return h.response({
                error:err.message
            }).code(400)
        }
    },
    async deleteData(request, h){
        try {
            const { email } = request.params;
            const result = await DDevelopment.deleteData(email)
            return h.response({
                result
            }).code(200)
        } catch (err) {
            console.error(err)
            return h.response({
                error: err.message
            }).code(400)
        }
    }
}

export default userDevelopment