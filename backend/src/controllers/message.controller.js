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
			.sort({ _id: -1 }) // Newest first
			.limit(parseInt(limit))
			.populate({
				path: "replyTo",
				select: "text image audio senderId sentAt", // Only fetch relevant fields
				populate: {
					path: "senderId",
					select: "username _id", // Optional: include sender name of original message
				},
			});

		res.status(200).json(messages.reverse()); // Send oldest first
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

export const sendMessage = async (req, res) => {
	try {
		const { text, image, audio, replyTo } = req.body;
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
			replyTo: replyTo || null,
			sentAt: new Date(),
		});

		const savedMessage = await newMessage.save();

		await Chat.findByIdAndUpdate(chatId, {
			lastMessage: newMessage._id,
			updatedAt: Date.now(),
		});

		io.to(chatId).emit("newMessage", savedMessage);

		const chat = await Chat.findById(chatId);
		const receiverId = chat.participants.find(
			(id) => id.toString() !== senderId.toString()
		);

		const receiverSocketId = userSocketMap[receiverId];

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

export const deleteMessage = async (req, res) => {
	try {
		const { id: messageId } = req.params;

		const updatedMessage = await Message.findByIdAndUpdate(
			messageId,
			{
				isDeleted: true,
				text: "", // Clear content if needed
				image: "",
				audio: "",
				deletedAt: new Date(),
			},
			{ new: true }
		);

		if (!updatedMessage) {
			return res.status(404).json({ message: "Message not found" });
		}

		res
			.status(200)
			.json({ message: "Message marked as deleted", updatedMessage });
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};

export const editMessage = async (req, res) => {
	try {
		const { id: messageId } = req.params;
		const { text, image, audio } = req.body;

		// Fetch the message first
		const message = await Message.findById(messageId);

		if (!message) {
			return res.status(404).json({ message: "Message not found" });
		}

		if (message.isDeleted) {
			return res.status(400).json({ message: "Cannot edit a deleted message" });
		}

		// Update only the fields provided
		message.text = text ?? message.text;
		message.image = image ?? message.image;
		message.audio = audio ?? message.audio;
		message.isEdited = true;
		message.editedAt = new Date();

		const updated = await message.save();

		res.status(200).json(updated);
	} catch (error) {
		res.status(500).json({ message: "Server error", error });
	}
};
