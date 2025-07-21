import handlebars from "express-handlebars"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"

const setupHandlebars = (app) => {

    const __filename = fileURLToPath(import.meta.url)
    const __dirname = dirname(__filename)

    app.engine('handlebars', handlebars.engine({
        defaultLayout: 'main',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }
    }))
    
    app.set('view engine', 'handlebars')
    app.set('views', path.join(__dirname, '..', 'views'))

}

export default setupHandlebars