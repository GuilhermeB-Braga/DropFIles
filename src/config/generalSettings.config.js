import flash from "connect-flash"
import session from "express-session"

const setupGeneralSettings = (app) => {

    app.use(
        session({
            secret: 'anything',
            resave: true,
            saveUninitialized: true
        })
    )

    app.use(flash())
    
    app.use((req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

}

export default setupGeneralSettings