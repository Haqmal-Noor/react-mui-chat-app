import express from "express";
import protectedRoute from "../middlewares/auth.middleware.js";
import {
	getMessages,
	sendMessage,
} from "../controllers/message.controller.js";

const router = express.Router();

router.get("/:id", protectedRoute, getMessages);

router.post("/send/:id", protectedRoute, sendMessage);

export default router;
