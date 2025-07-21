import bodyParser from "body-parser";

const setupBodyParser = (app) => {
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
}

export default setupBodyParser