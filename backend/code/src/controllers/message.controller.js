import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import { io, userSocketMap } from "../lib/socket.js";

import mongoose from "mongoose";

export const getMessages = async (req, res) => {
	try {
		const { id: chatId } = req.params;
		const { before, limit = 25 } = req.query;

		const query = { chatId };

		if (before && mongoose.Types.ObjectId.isValid(before)) {
			query._id = { $lt: before }; // Get messages before this ID
		}

		const messages = await Message.find(query)
			.sort({ _id: -1 }) // Newest messages first
			.limit(parseInt(limit));

		res.status(200).json(messages.reverse()); // Send oldest first to frontend
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};
export const sendMessage = async (req, res) => {
	try {
		const { text, image, audio } = req.body;
		const { id: chatId } = req.params;
		const senderId = req.user._id;

		if (!chatId) {
			return res
				.status(400)
				.json({ message: "Chat ID and content are required." });
		}

		const newMessage = new Message({
			chatId,
			senderId,
			text: audio ? "" : text,
			image: audio ? "" : image,
			audio,
			sentAt: new Date(),
		});

		const savedMessage = await newMessage.save();

		await Chat.findByIdAndUpdate(chatId, {
			lastMessage: newMessage._id,
			updatedAt: Date.now(),
		});

		// socket.emit("messageSent", { tempId, savedMessage });
		// Emit new message to everyone in the chat room
		io.to(chatId).emit("newMessage", savedMessage);

		// 🔔 Notification Logic
		const chat = await Chat.findById(chatId);
		const receiverId = chat.participants.find(
			(id) => id.toString() !== senderId.toString()
		);

		const receiverSocketId = userSocketMap[receiverId];

		// If receiver is online and not currently in the chat room
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("notification", {
				from: senderId,
				chatId,
				message: text || "📩 New message received",
			});
		}

		res.status(201).json(savedMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
