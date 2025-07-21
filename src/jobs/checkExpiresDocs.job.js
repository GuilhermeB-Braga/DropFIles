import Session from "../models/Session.model.js";
import File from "../models/File.model.js";

import fs from "fs/promises"

export const checkExpiresDocs = async () => {

    const now = new Date()
    const threshold = new Date(now.getTime() - 900000)
    
    const expiredDocs = await Session.find({createdAt: {$lte: threshold} })
    
    for(const session of expiredDocs){

        const relatedDocs = await File.find({sessionId: session._id})

        for(const file of relatedDocs){

            console.log(file)
            
            try {

                await fs.unlink(file.path)
                
            } catch (error) {

                console.warn(`⚠ Erro ao deletar arquivo: ${file.path}`, err.message);
                
            }

            await file.deleteOne()
            
        }

        await session.deleteOne()

    }
    
}