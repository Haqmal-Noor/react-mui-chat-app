import express from "express";
import protectedRoute from "../middlewares/auth.middleware.js";
import {
	getMessages,
	sendMessage,
} from "../controllers/message.controller.js";

// import Message from "../models/message.model.js";

const router = express.Router();

router.get("/:id", protectedRoute, getMessages);

router.post("/send/:id", protectedRoute, sendMessage);

export default router;
