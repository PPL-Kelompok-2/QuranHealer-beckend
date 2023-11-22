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
    }
}

export default userDevelopment