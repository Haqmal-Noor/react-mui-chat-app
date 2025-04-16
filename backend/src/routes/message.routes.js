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
// router.put("/:chatId", protectedRoute, markMessagesAsSeen);
// router.patch("/:id/read", async (req, res) => {
// 	try {
// 		const updated = await Message.findByIdAndUpdate(
// 			req.params.id,
// 			{ status: "seen" },
// 			{ new: true }
// 		);
// 		res.status(200).json(updated);
// 	} catch (err) {
// 		res.status(500).json({ error: "Failed to mark as read" });
// 	}
// });

export default router;
