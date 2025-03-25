import { useState, useRef, useEffect } from "react";
import {
	TextField,
	IconButton,
	Box,
	Paper,
	Avatar,
	Popper,
} from "@mui/material";
import { Send, AttachFile, InsertEmoticon } from "@mui/icons-material";
import Picker from "emoji-picker-react";
import { getCurrentTime } from "../services/getCurrentTime";
import axios from "axios";
import VoiceRecorder from "./VoiceRecorder";

function TransferMessage({ user, receiver, setMessages, socket }) {
	const [text, setText] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const fileInputRef = useRef(null);
	const emojiButtonRef = useRef(null);
	const emojiPickerRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				emojiPickerRef.current &&
				!emojiPickerRef.current.contains(event.target) &&
				emojiButtonRef.current &&
				!emojiButtonRef.current.contains(event.target)
			) {
				setShowEmojiPicker(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const handleKeyDown = (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSendMessage();
		}
	};

	const handleEmojiClick = (emojiObject) => {
		setText((prev) => prev + emojiObject.emoji);
	};

	const handleChange = (event) => {
		setText(event.target.value);
	};

	const handleFileChange = (event) => {
		if (event.target.files[0]) {
			setSelectedFile(event.target.files[0]);
		}
	};

	const handleSendMessage = async () => {
		if (user && receiver && (text.trim() !== "" || selectedFile)) {
			const newMessage = {
				sender: user.username,
				receiver,
				content: text.trim(),
				timestamp: getCurrentTime(),
				type: "sent",
				file: selectedFile ? URL.createObjectURL(selectedFile) : null,
			};

			const token = localStorage.getItem("token");

			try {
				setMessages((prev) => [...prev, newMessage]);
				await axios.post(
					"http://localhost:5000/api/chat/send",
					{ receiver, content: text, file: selectedFile },
					{ headers: { Authorization: `Bearer ${token}` } }
				);

				socket.emit("send-message", user.username, receiver, text.trim());

				socket.on("message-delivered", ({ sender, receiver }) => {
					console.log(sender);
					setMessages((prevMessages) =>
						prevMessages.map((msg) =>
							msg.sender === sender && msg.receiver === receiver
								? { ...msg, delivered: true }
								: msg
						)
					);
				});

				// socket.on("message-seen", ({ sender, receiver }) => {
				// 	console.log("heelo");
				// 	// Update messages in the sender's chat to set seen: true in real-time
				// 	setMessages((prevMessages) =>
				// 		prevMessages.map((msg) =>
				// 			msg.sender === sender && msg.receiver === receiver
				// 				? { ...msg, seen: true }
				// 				: msg
				// 		)
				// 	);
				// 	console.log(messages);
				// });

				setText("");
				setSelectedFile(null);

				// return () => {
				// 	socket.off("message-seen");
				// 	socket.off("message-delivered");
				// };
			} catch (error) {
				console.error("Error sending message:", error);
			}
		}
	};

	return (
		<Paper
			sx={{
				display: "flex",
				alignItems: "center",
				p: 2,
				borderRadius: 4,
				gap: 1,
			}}>
			<IconButton
				ref={emojiButtonRef}
				onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
				<InsertEmoticon color="primary" />
			</IconButton>
			<Popper
				open={showEmojiPicker}
				anchorEl={emojiButtonRef.current}
				placement="top-start">
				<Box
					ref={emojiPickerRef}
					sx={{
						zIndex: 9999,
						bgcolor: "white",
						boxShadow: 3,
						borderRadius: 2,
					}}>
					<Picker
						onEmojiClick={(event, emojiObject) => handleEmojiClick(emojiObject)}
					/>
				</Box>
			</Popper>

			<input
				type="file"
				hidden
				ref={fileInputRef}
				onChange={handleFileChange}
			/>
			<IconButton onClick={() => fileInputRef.current.click()}>
				<AttachFile color="primary" />
			</IconButton>

			<TextField
				variant="outlined"
				placeholder="Type a message"
				multiline
				fullWidth
				value={text}
				onChange={handleChange}
				onKeyDown={handleKeyDown}
				sx={{ flex: 1 }}
			/>

			{selectedFile && (
				<Avatar
					variant="rounded"
					src={URL.createObjectURL(selectedFile)}
					sx={{ width: 40, height: 40 }}
				/>
			)}

			{user && receiver && (
				<VoiceRecorder
					socket={socket}
					setMessages={setMessages}
					sender={user.username}
					receiver={receiver}
				/>
			)}

			<IconButton
				onClick={handleSendMessage}
				disabled={!text.trim() && !selectedFile}>
				<Send color={text.trim() || selectedFile ? "primary" : "disabled"} />
			</IconButton>
		</Paper>
	);
}

export default TransferMessage;
