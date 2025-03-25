import Message from "../models/message.model.js";
import User from "../models/user.model.js";

// Send message
export const sendMessage = async (req, res) => {
	try {
		const { receiver, content } = req.body;
		if (!receiver || !content)
			return res
				.status(400)
				.json({ message: "Receiver and content are required" });

		const receiverUser = await User.findOne({ username: receiver });
		if (!receiverUser) {
			return res.status(404).json({ message: "Receiver not found" });
		}

		const message = await Message.create({
			sender: req.user.id,
			receiver: receiverUser._id,
			content: content,
			delivered: false,
			seen: false,
		});
		res.status(201).json({ message: message });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// Save a voice message
export const saveVoiceMessage = async (req, res) => {
	try {
		const { sender, receiver, audio, format } = req.body;

		if (!sender || !receiver || !audio) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		const senderId = await User.findOne({ username: sender });
		if (!senderId)
			return res.status(500).json({ message: "sender not found!" });
		const receiverId = await User.findOne({ username: receiver });
		if (!receiverId)
			return res.status(500).json({ message: "receiver not found!" });

		const voiceMessage = new Message({
			sender: senderId,
			receiver: receiverId,
			audio: audio,
			format: format,
			content: "based64",
		});
		await voiceMessage.save();

		res
			.status(201)
			.json({ message: "Voice message saved successfully", senderId });
	} catch (error) {
		// console.error("Error saving voice message:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

// Get messages between users
export const getMessages = async (req, res) => {
	try {
		const { receiver } = req.params;
		if (!receiver)
			return res.status(400).json({ message: "Receiver is required" });

		const receiverId = await User.findOne({ username: receiver });
		if (!receiverId) {
			return res.status(404).json({ message: "Receiver not found" });
		}
		const messages = await Message.find({
			$or: [
				{ sender: req.user.id, receiver: receiverId },
				{ sender: receiverId, receiver: req.user.id },
			],
		}).sort("createdAt");

		const messagesWithType = messages.map((message) => {
			const msgObj = message.toObject ? message.toObject() : message;
			return {
				...msgObj,
				type: req.user.id === msgObj.receiver.toString() ? "received" : "sent",
			};
		});

		res.json(messagesWithType);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
// Mark Messages as Delivered
export const markDelivered = async (req, res) => {
	try {
		const { sender, receiver } = req.body;

		if (!sender || !receiver) {
			return res
				.status(400)
				.json({ message: "Sender and receiver are required" });
		}

		const receiverId = receiver._id;
		if (!receiverId) {
			return res.status(404).json({ message: "Receiver not found" });
		}
		const senderId = await User.findOne({ username: sender });
		if (!senderId) {
			return res.status(404).json({ message: "Sender not found" });
		}

		await Message.updateMany(
			{ sender: senderId, receiver: receiverId, delivered: false }, // Only update undelivered messages
			{ $set: { delivered: true } }
		);

		res
			.status(200)
			.json({ success: true, message: "Messages marked as delivered" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
// Mark Messages as Seen
export const markSeen = async (req, res) => {
	try {
		const { sender, receiver } = req.body;
		console.log(req.body);

		if (!sender || !receiver) {
			return res
				.status(400)
				.json({ message: "Sender and receiver are required" });
		}

		const receiverId = receiver._id;
		if (!receiverId) {
			return res.status(404).json({ message: "Receiver not found" });
		}
		const senderId = await User.findOne({ username: sender });
		if (!senderId) {
			return res.status(404).json({ message: "Sender not found" });
		}

		await Message.updateMany(
			{ sender: senderId, receiver: receiverId, seen: false }, // Only update unseen messages
			{ $set: { seen: true } }
		);

		res.status(200).json({ success: true, message: "Messages marked as seen" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};
