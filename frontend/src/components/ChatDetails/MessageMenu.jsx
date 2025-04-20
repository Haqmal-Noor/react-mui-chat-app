import { useState } from "react";
import {
	Menu,
	MenuItem,
	ListItemIcon,
	Divider,
	Box,
	IconButton,
	Popover,
} from "@mui/material";
import {
	Reply,
	Star,
	PushPin,
	Delete,
	CheckBox,
	Info,
	Add,
} from "@mui/icons-material";
import EmojiPicker from "emoji-picker-react";

const actions = [
	{ label: "Reply", icon: <Reply /> },
	{ label: "Star", icon: <Star /> },
	{ label: "Pin", icon: <PushPin /> },
	{ label: "Delete", icon: <Delete /> },
	{ label: "Select", icon: <CheckBox /> },
	{ label: "Info", icon: <Info /> },
];

const commonReactions = ["❤️", "😂", "😮", "😢", "👍"];

const MessageMenu = ({ anchorEl, onClose }) => {
	const open = Boolean(anchorEl);
	const [emojiAnchor, setEmojiAnchor] = useState(null);

	const handleEmojiClick = (emoji) => {
		console.log("Reacted with:", emoji);
		onClose(); // optionally close menu
	};

	const handlePlusClick = (event) => {
		setEmojiAnchor(event.currentTarget);
	};

	const handlePickerClose = () => {
		setEmojiAnchor(null);
	};

	return (
		<>
			<Menu
				anchorEl={anchorEl}
				open={open}
				onClose={onClose}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				transformOrigin={{ vertical: "top", horizontal: "right" }}
				PaperProps={{ sx: { width: 200, p: 1 } }}>
				{actions.map(({ label, icon }) => (
					<MenuItem
						key={label}
						onClick={() => {
							console.log(label);
							onClose();
						}}>
						<ListItemIcon>{icon}</ListItemIcon>
						{label}
					</MenuItem>
				))}

				{/* <Divider sx={{ my: 1 }} /> */}

				<Box sx={{ display: "flex", justifyContent: "space-between", px: 1 }}>
					{commonReactions.map((emoji) => (
						<IconButton
							key={emoji}
							onClick={() => handleEmojiClick(emoji)}
							size="small">
							<span style={{ fontSize: "1.2rem" }}>{emoji}</span>
						</IconButton>
					))}
					<IconButton onClick={handlePlusClick} size="small">
						<Add fontSize="small" />
					</IconButton>
				</Box>
			</Menu>

			{/* Optional Popover with full emoji picker */}
			<Popover
				open={Boolean(emojiAnchor)}
				anchorEl={emojiAnchor}
				onClose={handlePickerClose}
				anchorOrigin={{ vertical: "top", horizontal: "right" }}
				transformOrigin={{ vertical: "bottom", horizontal: "right" }}>
				<EmojiPicker
					onEmojiClick={(emojiData) => {
						handleEmojiClick(emojiData.emoji);
						handlePickerClose();
					}}
					height={350}
					width={300}
				/>
			</Popover>
		</>
	);
};

export default MessageMenu;
