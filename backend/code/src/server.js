import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import userRoutes from "./routes/user.routes.js";

import { app, server } from "./lib/socket.js";

dotenv.config();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

// Database connection
connectDB();

// Middleware
app.use(cookieParser()); // Add cookie-parser middleware
app.use(express.json({ limit: "50mb" })); // Increase limit to 50MB
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Increase for form data

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// const users = {}; // Map of users { username: socketId }
// const onlineUsers = new Set(); // Set to track unique online users

// // Socket.io setup
// io.on("connection", (socket) => {
// 	console.log("New socket connected:", socket.id);

// 	// Handle user connection
// 	socket.on("user-connected", async (username) => {
// 		if (!username) {
// 			console.error("Received null or invalid username.");
// 			return;
// 		}
// 		console.log(`${username} connected with socket ID: ${socket.id}`);
// 		users[username] = socket.id;
// 		onlineUsers.add(username);
// 		io.emit("updateOnlineUsers", Array.from(onlineUsers));

// 		const user = await User.findOne({ username: username });
// 		const messages = await Message.updateMany(
// 			{ receiver: user._id, delivered: false }, // Only update undelivered messages
// 			{ $set: { delivered: true } }
// 		);

// 		if (messages.modifiedCount > 0) {
// 			const updatedMessages = await Message.find({
// 				receiver: user._id,
// 				delivered: true,
// 			});
// 			io.emit("messages-delivered", updatedMessages);
// 		}
// 	});

// 	// Handle sending messages between users
// 	socket.on("send-message", async (sender, receiver, message) => {
// 		if (users[receiver]) {
// 			io.to(users[receiver]).emit("receive-message", {
// 				sender,
// 				content: message,
// 			});
// 			// Emit event back to sender that message was delivered (Frontend will call API)
// 			io.to(users[sender]).emit("message-delivered", { sender, receiver });
// 		}
// 	});
// 	// Handle message delivered (triggered from frontend API call)
// 	socket.on("message-delivered", (sender, receiver) => {
// 		if (users[sender]) {
// 			io.to(users[sender]).emit("message-delivered", { sender, receiver });
// 		}
// 	});
// 	socket.on("message-seen", ({ sender, receiver }) => {
// 		if (users[sender]) {
// 			// Notify the sender that the message was seen
// 			io.to(users[sender]).emit("message-seen", { sender, receiver });
// 		}
// 	});

// 	socket.on("send-voice", (sender, receiver, audioBlob) => {
// 		if (users[receiver]) {
// 			io.to(users[receiver]).emit("receive-voice", { sender, audioBlob });
// 			io.to(users[sender]).emit("message-delivered", { receiver });
// 		}
// 	});

// 	// Handle user disconnection
// 	socket.on("disconnect", () => {
// 		console.log("User disconnected:", socket.id);

// 		// Find and remove the user from the 'users' map and 'onlineUsers' set
// 		for (let username in users) {
// 			if (users[username] === socket.id) {
// 				delete users[username];
// 				onlineUsers.delete(username); // Remove user from the set
// 				break;
// 			}
// 		}

// 		// Emit updated list of online users
// 		io.emit("updateOnlineUsers", Array.from(onlineUsers));
// 	});
// });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
