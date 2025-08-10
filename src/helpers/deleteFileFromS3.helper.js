import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Client.config.js"

export const deleteFileFromS3 = async (key) => {

    try {
        
        const command = new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key
        })

        await s3.send(command)
        console.log(`Arquivo ${key} deletado com sucesso.`)
        
    } catch (error) {
        
        console.log(`Falha ao deletar o arquivo da s3. `, error)
        
    }
    
}