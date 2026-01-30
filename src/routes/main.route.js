import express from "express"
const router = express.Router()

import { getDocs, getFile, getQRCode, getSession, home, postFile, postSession, postSessionLogin } from "../controllers/main.controllers.js"

router.get("/", home)
router.get("/docs", getDocs)

// Session routes
router.get("/session/:sessionId", getSession)
router.post("/session", postSession)
router.post("/session/login", postSessionLogin)

// File route
router.post("/file", postFile)
router.get("/file/:filename/:originalname", getFile)

// QR CODE
router.get("/qrcode", getQRCode)

export default router