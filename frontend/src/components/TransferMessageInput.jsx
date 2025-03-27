import { useState, useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
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
import { getCurrentTime } from "../services/getCurrentTime";
import { toast } from "react-toastify";

// import VoiceRecorder from "./VoiceRecorder";

function TransferMessageInput() {
	const [text, setText] = useState("");
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [selectedFile, setSelectedFile] = useState(null);
	const fileInputRef = useRef(null);
	const emojiButtonRef = useRef(null);
	const emojiPickerRef = useRef(null);

	const { sendMessage } = useChatStore();

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
		if (!text.trim() && !selectedFile) return;

		try {
			await sendMessage({ text: text.trim(), image: selectedFile });
			setText("");
			setSelectedFile(null);
			if (fileInputRef.current) fileInputRef.current.value = "";
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
							onEmojiClick={(event, emojiObject) =>
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

				{/* {user && receiver && (
				<VoiceRecorder
					socket={socket}
					setMessages={setMessages}
					sender={user.username}
					receiver={receiver}
				/>
			)} */}

				<IconButton
					onClick={handleSendMessage}
					disabled={!text.trim() && !selectedFile}>
					<Send color={text.trim() || selectedFile ? "primary" : "disabled"} />
				</IconButton>
			</Paper>
		</div>
	);
}

export default TransferMessageInput;
