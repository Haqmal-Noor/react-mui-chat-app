import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

import {
	TextField,
	IconButton,
	Box,
	Paper,
	Avatar,
	Popper,
} from "@mui/material";
import { Send, AttachFile, InsertEmoticon, Close } from "@mui/icons-material";
import Picker from "emoji-picker-react";
import { toast } from "react-toastify";

import VoiceRecorder from "./VoiceRecorder";
import { playSoundWithWebAudio } from "../../utils/playSound";

function TransferMessageInput() {
	const [text, setText] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);

	const fileInputRef = useRef(null);
	const emojiButtonRef = useRef(null);
	const emojiPickerRef = useRef(null);

	const { selectedChat, sendMessage, isSendingMessage } = useChatStore();
	const { authUser } = useAuthStore();

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
		const newText = event.target.value;
		setText(newText);

		if (!selectedChat || !authUser) return;

		useChatStore.getState().handleTyping({
			roomId: selectedChat._id,
			userId: authUser._id,
		});
	};

	const removeImage = () => {
		setSelectedFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		if (!file.type.startsWith("image/")) {
			toast.error("Please choose an image type");
			return;
		}
		const reader = new FileReader();
		reader.onloadend = () => {
			setSelectedFile(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const handleSendMessage = async () => {
		if (isSendingMessage) return;
		if (!text.trim() && !selectedFile) return;

		try {
			await sendMessage({ text: text.trim(), image: selectedFile });
			setText("");
			setSelectedFile(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
			playSoundWithWebAudio("/sounds/sent-message.wav");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div>
			{selectedFile && (
				<div style={{ display: "flex", alignItems: "start" }}>
					<Avatar
						variant="rounded"
						src={selectedFile}
						sx={{ width: 80, height: 80 }}
					/>
					<IconButton onClick={removeImage}>
						<Close />
					</IconButton>
				</div>
			)}
			<Paper
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					p: { xs: 1, sm: 2 }, // smaller padding on mobile
					borderRadius: 0,
					flexWrap: "wrap", // makes it responsive
					gap: 0.5, // tighter spacing between icons
					maxWidth: "100%", // ensure it doesn't overflow
				}}>
				<IconButton
					sx={{ p: 0.5 }}
					size="small"
					ref={emojiButtonRef}
					onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
					<InsertEmoticon fontSize="small" color="primary" />
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
							onEmojiClick={(emojiObject, event) =>
								handleEmojiClick(emojiObject)
							}
						/>
					</Box>
				</Popper>

				<input
					type="file"
					hidden
					ref={fileInputRef}
					onChange={handleFileChange}
				/>
				<IconButton
					sx={{ p: 0.5 }}
					size="small"
					onClick={() => fileInputRef.current.click()}>
					<AttachFile fontSize="small" color="primary" />
				</IconButton>

				<TextField
					variant="outlined"
					placeholder="Type a message"
					multiline
					fullWidth
					value={text}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					sx={{
						flex: 1,
						px: 0,
						"& .MuiOutlinedInput-root": {
							"& fieldset": {
								border: "none",
							},
							"&:hover fieldset": {
								border: "none",
							},
							"&.Mui-focused fieldset": {
								border: "none",
							},
						},
					}}
				/>

				<VoiceRecorder />

				<IconButton
					sx={{ p: 0.5 }}
					onClick={handleSendMessage}
					disabled={!text.trim() && !selectedFile}
					size="small">
					<Send color={text.trim() || selectedFile ? "primary" : "disabled"} />
				</IconButton>
			</Paper>
		</div>
	);
}

export default TransferMessageInput;
