import {
	Avatar,
	Card,
	CardMedia,
	Typography,
	Box,
	IconButton,
} from "@mui/material";
import {
	Check,
	DoneAllOutlined,
	AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

import { format } from "date-fns";
import AudioPlayer from "./AudioPlayer";
import MessageMenu from "./MessageMenu";
import { useState } from "react";

const ChatMessage = ({
	message,
	authUser,
	selectedChat,
	isSendingMessage,
	onImageClick,
}) => {
	const isSentByCurrentUser = message.senderId === authUser._id;

	const [menuAnchor, setMenuAnchor] = useState(null);
	const openMenu = (event) => setMenuAnchor(event.currentTarget);
	const closeMenu = () => setMenuAnchor(null);

	const senderPic = isSentByCurrentUser
		? authUser.profilePic
		: selectedChat.participants.find((p) => p._id === message.senderId)
				?.profilePic;

	return (
		<>
			<Avatar src={senderPic} />
			<Card
				sx={{
					p: 1.5,
					maxWidth: "60%",
					minWidth: "10%",
					backgroundColor: isSentByCurrentUser ? "primary.light" : "grey.300",
					borderRadius: 2,
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
						color={isSentByCurrentUser ? "white" : "black"}
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
						mt: 1,
					}}>
					<Typography
						sx={{
							fontSize: "10px",
							color: isSentByCurrentUser ? "white" : "black",
							flex: 1,
							textAlign: isSentByCurrentUser ? "right" : "left",
						}}>
						{format(new Date(message.createdAt), "p")}
					</Typography>

					{isSentByCurrentUser && (
						<Box sx={{ ml: 1 }}>
							{isSendingMessage ? (
								message.isLastMessage && (
									<AccessTimeIcon sx={{ fontSize: 14, color: "white" }} />
								)
							) : (
								<>
									{message.status === "sent" && (
										<Check sx={{ fontSize: 14, color: "white" }} />
									)}
								</>
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
