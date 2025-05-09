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
		replyTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			default: null,
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		deletedAt: {
			type: Date,
			default: null,
		},
		isEdited: { type: Boolean, default: false },
		editedAt: { type: Date, default: null },

		text: {
			type: String,
		},
		image: {
			type: String,
		},
		audio: {
			type: String,
		},

		sentAt: { type: Date },
		deliveredAt: { type: Date },
		seenAt: { type: Date },
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
