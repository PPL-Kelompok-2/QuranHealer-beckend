import dotenv from 'dotenv'
import AWS from 'aws-sdk'
dotenv.config({path:'../../.env'})

AWS.config.update({
    accessKeyId: process.env.ACCESSAWS,
    secretAccessKey: process.env.SECRETAWS,
    endpoint: process.env.ENDPOINTAWS 
})

const s3 = new AWS.S3();

export default s3