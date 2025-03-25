import express from "express";
import {
	sendMessage,
	getMessages,
	saveVoiceMessage,
	markDelivered,
	markSeen,
} from "../controllers/message.controller.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/send", authenticate, sendMessage);
router.post("/send-voice-message", authenticate, saveVoiceMessage);
router.get("/:receiver", authenticate, getMessages);
router.post("/mark-delivered", authenticate, markDelivered);
router.post("/mark-seen", authenticate, markSeen);

export default router;
