import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
	{
		isGroup: { type: Boolean, default: false },
		participants: [
			{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		],
		groupName: { type: String },
		groupPic: { type: String },
		adminIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
		lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message" },
	},
	{ timestamps: true }
);
const Chat = mongoose.model("Chat", ChatSchema);

export default Chat;
