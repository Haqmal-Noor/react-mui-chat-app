import { useRef, useEffect } from "react";
import { Box, Paper, Typography } from "@mui/material";
import ReceivedMessage from "./ReceivedMessage";
import SentMessage from "./SentMessage";
import TransferMessage from "./TransferMessage";
import socket from "../services/socket";
import { getCurrentTime } from "../services/getCurrentTime";
import axios from "axios";


function SingleChat({ onlineUsers, user, messages, setMessages, receiver }) {
	const messagesRef = useRef(null);

	useEffect(() => {
		socket.on("receive-message", async (data) => {
			setMessages((prevMessages) => [
				...prevMessages,
				{ ...data, timestamp: getCurrentTime(), type: "received" },
			]);

			// API call to mark message as delivered
			await axios.post(
				"http://localhost:5000/api/chat/mark-delivered",
				{
					sender: data.sender,
					receiver: user, // current user
				},
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			// await axios.post(
			// 	"http://localhost:5000/api/chat/mark-seen",
			// 	{
			// 		sender: receiver, // The person who sent the message
			// 		receiver: user, // Current user (receiver of message)
			// 	},
			// 	{
			// 		headers: {
			// 			Authorization: `Bearer ${localStorage.getItem("token")}`,
			// 		},
			// 	}
			// );
			// Notify sender that message was delivered
			socket.emit("message-delivered", { sender: data.sender, receiver: user });
			// socket.emit("message-seen", { sender: data.sender, receiver: user });
		});

		// socket.on("message-seen", ({ sender, receiver }) => {
		// 	console.log(sender);
		// 	// Update messages in the sender's chat to set seen: true in real-time
		// 	setMessages((prevMessages) =>
		// 		prevMessages.map((msg) =>
		// 			msg.sender === sender && msg.receiver === receiver
		// 				? { ...msg, seen: true }
		// 				: msg
		// 		)
		// 	);
		// });

		socket.on("receive-voice", async ({ sender, audioBlob }) => {
			const byteCharacters = atob(audioBlob.split(",")[1]);
			const byteArrays = [];
			for (let i = 0; i < byteCharacters.length; i++) {
				byteArrays.push(byteCharacters.charCodeAt(i));
			}
			const audioBlobObject = new Blob([new Uint8Array(byteArrays)], {
				type: "audio/webm",
			});
			const audioUrl = URL.createObjectURL(audioBlobObject);

			setMessages((prev) => [
				...prev,
				{
					sender,
					receiver,
					content: audioUrl,
					type: "received",
					format: "audio/webm",
					timestamp: new Date().toLocaleTimeString(),
				},
			]);
		});

		return () => {
			socket.off("receive-message");
			socket.off("receive-voice");
		};
	}, [receiver, setMessages, user]);

	// useEffect(() => {
	// 	const markSeen = async () => {
	// 		console.log("seen");
	// 		if (messages.length > 0) {

	// 			// Emit socket event to notify sender that messages were seen
	// 			socket.emit("message-seen", { sender: receiver, receiver: user });
	// 		}
	// 	};
	// 	markSeen();
	// }, [receiver]);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	return (
		<Paper
			elevation={3}
			sx={{
				display: "flex",
				flexDirection: "column",
				height: "90vh",
				gap: 2,
				p: 2,
				px: 5,
				borderRadius: 0,
				boxShadow: 0,
			}}>
			<Box
				ref={messagesRef}
				sx={{
					flexGrow: 1,
					overflowY: "auto",
					p: 2,
					borderRadius: 2,
					"&:hover": { scrollbarWidth: "thin" },
				}}>
				{messages.map((message, index) =>
					message.type === "received" ? (
						<ReceivedMessage receivedMessage={message} key={index} />
					) : (
						<SentMessage
							onlineUsers={onlineUsers}
							receiver={receiver}
							sentMessage={message}
							key={index}
						/>
					)
				)}
			</Box>
			<TransferMessage
				user={user}
				receiver={receiver}
				messages={messages}
				setMessages={setMessages}
				socket={socket}
			/>
		</Paper>
	);
}

export default SingleChat;
