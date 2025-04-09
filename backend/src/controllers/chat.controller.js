import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

// Create a new chat (one-on-one or group)
export const createChat = async (req, res) => {
	try {
		const { participants, isGroup, groupName, groupPic, adminIds } = req.body;

		// Validate participants
		if (!participants || participants.length < 2) {
			return res
				.status(400)
				.json({ message: "A chat must have at least two participants." });
		}

		// Check if a one-on-one chat already exists
		if (!isGroup) {
			const existingChat = await Chat.findOne({
				isGroup: false,
				participants: { $all: participants },
			});

			if (existingChat) {
				return res.status(200).json(existingChat);
			}
		}

		// Create new chat
		const newChat = new Chat({
			isGroup,
			participants,
			groupName: isGroup ? groupName : null,
			groupPic: isGroup ? groupPic : null,
			adminIds: isGroup ? adminIds : [],
			lastImage: null,
		});

		await newChat.save();

		const chatToBeSent = await Chat.findById(newChat._id).populate(
			"participants",
			"username profilePic"
		);

		res.status(201).json(chatToBeSent);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

// Get all chats for a user
export const getUserChats = async (req, res) => {
	try {
		const userId = req.user.id; // Assuming user is authenticated

		const chats = await Chat.find({ participants: userId })
			.populate("participants", "username profilePic")
			.populate("lastMessage");

		res.status(200).json(chats);
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};
// Get a chat by its ID
export const getChatById = async (req, res) => {
	try {
		const { id } = req.params;
		const userId = req.user._id; // Assumes user ID is available from auth middleware

		if (!id) {
			return res.status(400).json({ message: "Chat ID is required." });
		}

		// Find the chat by ID and ensure the current user is a participant
		const chat = await Chat.findOne({
			_id: id,
			participants: userId, // Filter to ensure user is a participant
		})
			.populate("participants", "username profilePic")
			.populate("lastMessage");

		if (!chat) {
			return res
				.status(404)
				.json({ message: "Chat not found or access denied." });
		}

		res.status(200).json(chat);
	} catch (error) {
		console.log(error);
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};
