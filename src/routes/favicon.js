import s3 from '../utils/bucketaws.js'

const favicon = [{
  method: "GET",
  path: "/favicon.ico",
  handler: async (request, h) => {
    const params = {
      Bucket: "backend-quranhealer",
      Key: 'favicon/favicon.ico'
    }
    try{
      const data = await s3.getObject(params).promise();
      return h.response(data.Body).code(200)
    }catch(err){
      console.error(err)
      return h.response('Gagal mengunduh').code(400)
    }
  },
}];

export default favicon;
