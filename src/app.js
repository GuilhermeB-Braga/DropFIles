// Routes Imports
import mainRoutes from "./routes/main.route.js"

// App configs
import app from "./config/express.config.js";
import setupHandlebars from "./config/handlebars.config.js";
import dotenv from "dotenv"
import setupBodyParser from "./config/bodyParser.config.js";
import setupGeneralSettings from "./config/generalSettings.config.js";
import setupMongoose from "./config/mongoose.config.js";

import { checkExpiresDocs } from "./jobs/checkExpiresDocs.job.js";

dotenv.config()


// Set app configs
setupHandlebars(app)
setupBodyParser(app)
setupGeneralSettings(app)
setupMongoose(process.env.DB_USER, process.env.DB_PASSWORD)

// Jobs

setInterval(()=>{

    checkExpiresDocs().catch( err => console.log(err))

    console.log("Time Checked.")
    
}, 10000)

// Server

app.use("/", mainRoutes)

app.listen(process.env.PORT, () => {

    console.log(`Server ON: http://localhost:${process.env.PORT}`)
    
})