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

// used to store online users
const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("A user connected", socket.id);

	// const userId = socket.handshake.query.userId;
	// if (userId) userSocketMap[userId] = socket.id;

	socket.on("joinChat", (chatId) => {
		socket.join(chatId);
		userSocketMap[socket.id] = chatId;

		console.log(`User: ${socket.id} joined chat: ${chatId}`);
	});

	// io.emit() is used to send events to all the connected clients
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	socket.on("disconnect", () => {
		console.log("A user disconnected", socket.id);
		const chatId = userSocketMap[socket.id];
		if (chatId) {
			console.log(`User: ${socket.id} left chat: ${chatId}`);
			socket.leave(chatId);

			delete userSocketMap[socket.id];
		}
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { io, app, server };
