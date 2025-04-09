import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		chatId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Chat",
			required: true,
		},
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		// receiverId: {
		// 	type: mongoose.Schema.Types.ObjectId,
		// 	ref: "User",
		// 	required: true,
		// },
		text: {
			type: String,
		},
		image: {
			type: String,
		},
		audio: {
			type: String,
		},
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
