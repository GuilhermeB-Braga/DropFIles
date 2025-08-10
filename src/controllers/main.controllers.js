// Amazon S3 config
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/s3Client.config.js";

const storage = multer.memoryStorage()
const upload = multer({storage}).single('file')

// 
import Session from "../models/Session.model.js"
import File from "../models/File.model.js";

import multer from "multer";
import path from "path";
import { fileURLToPath } from "url"
import { dirname } from "path"
import { generateQrBuffer } from "../helpers/qrcodeGenerator.helper.js";
import { generateTemporaryURL } from "../helpers/generateTemporaryURL.helper.js";

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

    upload(req, res, async (err) => {

        if(err instanceof multer.MulterError){
            return res.status(500).send(err)

        }else if(err){
            return res.status(500).send(err)

        }

        try {

            console.log(req.file)

            const uniqueName = `${Date.now()}_${req.file.originalname}`


            const command = new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: uniqueName,
                Body: req.file.buffer,
                ContentType: req.file.mimetype,
            })

            await s3.send(command)

            const s3Url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueName}`
            
            // Save file datas on db

            const newFile = ({
                originalname: req.file.originalname,
                savedName: uniqueName,
                fileSize: req.file.size,
                path: s3Url,
                sessionId: req.body.sessionId
            })

            const file = await new File(newFile).save()
            
            req.flash("success_msg", "Uploado concluído com sucesso!")
            res.redirect(`session/${req.body.sessionId}`)
            
            
            
        }catch(err){

            console.log(err)
            
        }
        
        
    })
    
}

export const getFile = async (req, res) => {

    const {filename, originalname} = req.params

    
    try {

        const url = await generateTemporaryURL(filename, originalname, 300)
        return res.redirect(url)
        
    } catch (error) {

        console.log("Erro ao realizar o download do arquivo: " + error)
        
    }

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