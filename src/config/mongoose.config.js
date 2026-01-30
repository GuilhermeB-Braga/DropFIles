import mongoose from "mongoose"

const setupMongoose = async (DB_USER, DB_PASSWORD) => {

    mongoose.Promise = global.Promise

    try {

        await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@cluster0.8gdwknx.mongodb.net/droppe?retryWrites=true&w=majority&appName=Cluster0`)

        console.log("Conectado ao Banco de Dados")
        
    } catch (error) {

        console.log("@DB_ERROR: " + error)
        
    }

    
}

export default setupMongoose