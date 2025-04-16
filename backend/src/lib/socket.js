import { Server } from "socket.io";
import http from "http";
import express from "express";

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
const userSocketMap = {}; // {userId: socketId}

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
	// Handle message delivered
	socket.on("messageDelivered", ({ messageId, from }) => {
		const socketId = userSocketMap[from];
		if (socketId) {
			io.to(socketId).emit("messageStatus", { messageId, status: "delivered" });
		}
	});

	// Handle message seen
	socket.on("messageSeen", ({ messageId, from }) => {
		const socketId = userSocketMap[from];
		if (socketId) {
			io.to(socketId).emit("messageStatus", { messageId, status: "seen" });
		}
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
