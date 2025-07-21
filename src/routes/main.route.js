import express from "express"
const router = express.Router()

import { getFile, getQRCode, getSession, home, postFile, postSession, postSessionLogin } from "../controllers/main.controllers.js"

router.get("/", home)

// Session routes
router.get("/session/:sessionId", getSession)
router.post("/session", postSession)
router.post("/session/login", postSessionLogin)

// File route
router.post("/file", postFile)
router.get("/file/:fileName/:originalname", getFile)

// QR CODE
router.get("/qrcode", getQRCode)

export default router