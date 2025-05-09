import express from "express";
import protectedRoute from "../middlewares/auth.middleware.js";
import {
	getMessages,
	sendMessage,
	editMessage,
	deleteMessage,
} from "../controllers/message.controller.js";

// import Message from "../models/message.model.js";

const router = express.Router();

router.get("/:id", protectedRoute, getMessages);
router.post("/send/:id", protectedRoute, sendMessage);
router.put("/edit/:id", protectedRoute, editMessage);
router.delete("/delete/:id", protectedRoute, editMessage);

export default router;
