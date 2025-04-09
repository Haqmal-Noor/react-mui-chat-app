import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getMessages = async (req, res) => {
	try {
		const { id: chatId } = req.params;

		const messages = await Message.find({ chatId });

		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json({ message: "Server Error", error: error.message });
	}
};

// export const getMessages = async (req, res) => {
// 	try {
// 		const { id: userToChatId } = req.params;
// 		const myId = req.user._id;

// 		const messages = await Message.find({
// 			$or: [
// 				{ senderId: myId, receiverId: userToChatId },
// 				{ senderId: userToChatId, receiverId: myId },
// 			],
// 		});

// 		res.status(200).json(messages);
// 	} catch (error) {
// 		console.log("Error in getMessages controller: ", error.message);
// 		res.status(500).json({ error: "Internal server error" });
// 	}
// };

export const sendMessage = async (req, res) => {
	try {
		const { text, image, audio } = req.body;
		const { id: chatId } = req.params;
		const senderId = req.user._id;

		// todo: better validation required
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
		});

		const savedMessage = await newMessage.save(); // Ensure message is saved before emitting

		await Chat.findByIdAndUpdate(chatId, {
			lastMessage: newMessage._id,
			updatedAt: Date.now(),
		});
		io.to(chatId).emit("newMessage", savedMessage); // Emit only after saving
		res.status(201).json(savedMessage);
	} catch (error) {
		console.log("Error in sendMessage controller: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
