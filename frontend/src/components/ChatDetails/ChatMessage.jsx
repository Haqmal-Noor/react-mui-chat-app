import {
	Avatar,
	Card,
	CardMedia,
	Typography,
	Box,
	IconButton,
} from "@mui/material";
import { Check, AccessTime as AccessTimeIcon } from "@mui/icons-material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import DoubleCheckIcon from "@mui/icons-material/DoneAll";

import { useTheme } from "@mui/material/styles";

import { format } from "date-fns";
import AudioPlayer from "./AudioPlayer";
import MessageMenu from "./MessageMenu";
import { useState } from "react";

const ChatMessage = ({ message, authUser, selectedChat, onImageClick }) => {
	const isSentByCurrentUser = message.senderId === authUser._id;

	const [menuAnchor, setMenuAnchor] = useState(null);
	const openMenu = (event) => setMenuAnchor(event.currentTarget);
	const closeMenu = () => setMenuAnchor(null);

	const senderPic = isSentByCurrentUser
		? authUser.profilePic
		: selectedChat.participants.find((p) => p._id === message.senderId)
				?.profilePic;
	const theme = useTheme();

	return (
		<>
			<Avatar src={senderPic} />
			<Card
				sx={{
					py: 0.7,
					px: 1,
					maxWidth: "75%",
					minWidth: "10%",
					backgroundColor: isSentByCurrentUser
						? theme.palette.primary.main
						: theme.palette.background.default,
					borderRadius: 1,
					wordBreak: "break-word",
					overflowWrap: "anywhere",
					display: "flex",
					flexDirection: "column",
				}}>
				{message.image && (
					<CardMedia
						component="img"
						image={message.image}
						alt="Message attachment"
						onClick={() => onImageClick(message.image)}
						sx={{
							borderRadius: 1,
							mb: 1,
							width: "100%",
							maxWidth: 250,
							objectFit: "cover",
							cursor: "pointer",
						}}
					/>
				)}

				{message.text && (
					<Typography
						variant="body1"
						color={isSentByCurrentUser ? "white" : theme.palette.text.primary}
						sx={{ whiteSpace: "pre-wrap" }}>
						{message.text}
					</Typography>
				)}

				{message.audio && <AudioPlayer src={message.audio} />}

				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mt: 0.5,
					}}>
					<Typography
						sx={{
							fontSize: "9px",
							color: isSentByCurrentUser ? "white" : theme.palette.text.primary,
							flex: 1,
							textAlign: "left",
						}}>
						{format(new Date(message.createdAt), "p")}
					</Typography>

					{isSentByCurrentUser && (
						<Box>
							{message.seenAt ? (
								<DoubleCheckIcon sx={{ color: "blue", fontSize: "14px" }} />
							) : (
								<Check sx={{ color: "white", fontSize: "14px" }} />
							)}
						</Box>
					)}
				</Box>
			</Card>
			<IconButton onClick={openMenu}>
				<EmojiEmotionsIcon />
				<KeyboardArrowDownIcon />
			</IconButton>
			<MessageMenu anchorEl={menuAnchor} onClose={closeMenu} />
		</>
	);
};

export default ChatMessage;
