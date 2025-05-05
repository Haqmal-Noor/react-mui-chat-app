import { Server } from "socket.io";
import http from "http";
import express from "express";

import Message from "../models/message.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
	cors: {
		origin: ["http://localhost:5173"],
	},
});

export function getReceiverSocketId(userId) {
	return userSocketMap[userId];
}

// Used to store online users
export const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId) {
		userSocketMap[userId] = socket.id;
	}

	// Emit online users when a new user connects
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("joinChat", (chatId) => {
		socket.join(chatId);
		console.log(`User: ${socket.id} joined chat: ${chatId}`);
	});

	socket.on("delivered", async ({ messageIds }) => {
		console.log("hello i am here?");
		// 1) Update DB
		await Message.updateMany(
			{ _id: { $in: messageIds }, deliveredAt: undefined },
			{ deliveredAt: new Date() }
		);

		// 2) Fetch the messages so we know each sender
		const deliveredMessages = await Message.find({ _id: { $in: messageIds } });

		// 3) Notify each sender
		deliveredMessages.forEach((message) => {
			const senderSocket = getReceiverSocketId(message.senderId);
			if (senderSocket) {
				io.to(senderSocket).emit("messageDelivered", {
					messageId: message._id,
					deliveredAt: message.deliveredAt,
				});
			}
		});
	});

	socket.on("seen", async ({ messageIds }) => {
		// 1) Update DB
		await Message.updateMany(
			{ _id: { $in: messageIds }, seenAt: undefined },
			{ seenAt: new Date() }
		);

		// 2) Fetch the messages so we know each sender
		const seenMessages = await Message.find({ _id: { $in: messageIds } });
		// 3) Notify each sender
		seenMessages.forEach((message) => {
			const senderSocket = getReceiverSocketId(message.senderId);
			if (senderSocket) {
				io.to(senderSocket).emit("messageSeen", {
					messageId: message._id,
					seenAt: message.seenAt,
				});
			}
		});
	});

	socket.on("typing", ({ room, userId }) => {
		socket.to(room).emit("typing", { userId });
	});

	socket.on("stopTyping", ({ room, userId }) => {
		socket.to(room).emit("stopTyping", { userId });
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected", socket.id);
		// Find the userId by socket.id from the userSocketMap
		const userIndex = Object.keys(userSocketMap).find(
			(key) => userSocketMap[key] === socket.id
		);
		if (userIndex) {
			// Leave any rooms if needed (optional based on your logic)
			const chatRooms = socket.rooms; // Get all rooms this socket belongs to
			chatRooms.forEach((room) => {
				socket.leave(room);
				console.log(`User: ${socket.id} left chat: ${room}`);
			});

			// Remove the user from the map
			delete userSocketMap[userIndex];
			console.log(`User with ID: ${userIndex} removed from online users`);

			// Emit updated online users
			io.emit("getOnlineUsers", Object.keys(userSocketMap));
		}
	});
});

export { io, app, server };
