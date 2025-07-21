import Session from "../models/Session.model.js"
import File from "../models/File.model.js";

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url"
import { dirname } from "path"
import { generateQrBuffer } from "../helpers/qrcodeGenerator.helper.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const home = (req, res) => {

    res.render("home")
    
}

export const getSession = async (req, res) => {

    try {

        const session = await Session.findById(req.params.sessionId)
        const files = await File.find({sessionId: req.params.sessionId})

        
        if(!session){
            req.flash("error_msg", "Sessão expirada ou inexistente")
            res.redirect("/")
        }

        const thresholdTime = new Date(session.createdAt.getTime() + 900000)
        const remainingTime = thresholdTime.getTime() - Date.now()

        console.log("Tempo Limite: " + thresholdTime + "Tempo restante: " + remainingTime)
        
        res.render("session", {session, sessionId: req.params.sessionId, file: files, remainingTime, thresholdTime})
        
    } catch (error) {

        console.log(error)
        
    }

    
}

export const postSession = async (req, res) => {

    const accessCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    const sessionName = req.body.sessionName

    try {

        const newSession = {sessionName, accessCode}
        
        const session = await new Session(newSession).save()

        req.flash("success_msg", "Sessão criada.")

        res.redirect(`/session/${session.id}`)
        
    } catch (error) {

        req.flash("error_msg", "Falha ao criar sessão.")

        console.log(error)

        res.redirect("/")
    }
    
}

export const postSessionLogin = async (req, res) => {

    const accessCode = req.body.accessCode
    const sessionName = req.body.sessionName
    
    try {
        
        const session = await Session.findOne({sessionName: sessionName, accessCode: accessCode})

        if(!session){
            req.flash("error_msg", "Sessão não encontrada.")
            res.redirect("/")
        }
        
         res.redirect(`/session/${session.id}`)

    } catch (error) {
        
    }
    
}

// File routes

export const postFile = (req, res) => {

    const storage = multer.diskStorage({

        destination: (req, file, cb) => {
            cb(null, `${path.join(__dirname, "../../public/uploads")}`)
        },
        
        filename: (req, file, cb) => {
            cb(null, Date.now() + path.extname(file.originalname))
        }
    })

    const upload = multer({storage}).single('file')

    upload(req, res, async (err) => {

        if(err instanceof multer.MulterError){
            return res.status(500).send(err)

        }else if(err){
            return res.status(500).send(err)

        }

        // Save file datas on db

        const newFile = ({
            originalname: req.file.originalname,
            savedName: req.file.filename,
            fileSize: req.file.size,
            path: req.file.path,
            sessionId: req.body.sessionId
        })

        const file = await new File(newFile).save()
        
        req.flash("success_msg", "Uploado concluído com sucesso!")
        res.redirect(`session/${req.body.sessionId}`)
        
    })
    
}

export const getFile = (req, res) => {

    const filePath = path.join(__dirname, "../../public/uploads/", req.params.fileName) 

    res.download(filePath, req.params.originalname, (err) => {

        console.log(err)

    })
    
}

// QR CODE

export const getQRCode = async (req, res) => {

    const text = req.query.text || 'http://192.168.15.54:9091'

    try {

        const buffer = await generateQrBuffer(text)

        res.writeHead(200, {
        'Content-Type': 'image/png',
        'Content-Length': buffer.length
        })

        res.end(buffer)
        
    } catch (error) {

        res.status(500).send('Erro ao gerar QR Code: ' + error)
        
    }
    
}