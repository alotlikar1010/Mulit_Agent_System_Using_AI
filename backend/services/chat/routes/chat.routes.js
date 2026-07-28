import express from "express"
import { getConversation, getMessage, saveMessage, updateConversation } from "../controllers/chat.controller"
const router = express.Router()

router.get("/get-conversation", getConversation)
router.get("/get-message/:conversationId", getMessage)
router.post("/save-message", saveMessage)
router.post("/update-conversation/", updateConversation)

export default router