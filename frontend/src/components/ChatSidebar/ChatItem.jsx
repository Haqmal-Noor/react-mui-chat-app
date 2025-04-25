import { Avatar, Badge, Box, Typography } from "@mui/material";
import { useAuthStore } from "../../store/useAuthStore";

import MicIcon from "@mui/icons-material/Mic";
import ImageIcon from "@mui/icons-material/Image";

function ChatItem({ chat }) {
	const { authUser, onlineUsers } = useAuthStore();
	// todo: remove this function and put it in a file
	const getReceiver = (chatParticipants, senderId) => {
		return chatParticipants.find((userId) => userId._id !== senderId);
	};
	return (
		<Box
			component="a"
			href="#!"
			sx={{
				display: "flex",
				width: "100%",
				justifyContent: "space-between",
				textDecoration: "none",
				color: "inherit",
				py: 1,
				px: 1,
				borderRadius: 1,
				"&:hover": { backgroundColor: "action.hover" },
			}}>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
				<Box sx={{ position: "relative", mr: 2 }}>
					<Badge
						variant="dot"
						color={
							onlineUsers.includes(
								getReceiver(chat.participants, authUser._id)._id
							)
								? "primary"
								: ""
						}
						overlap="circular"
						anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
						<Avatar
							src={getReceiver(chat.participants, authUser._id).profilePic}
						/>
					</Badge>
				</Box>
				<Box>
					<Typography variant="subtitle1" fontWeight="bold">
						{getReceiver(chat.participants, authUser._id).username}
					</Typography>
					<Typography
						sx={{
							whiteSpace: "nowrap",
							overflow: "hidden",
							textOverflow: "ellipsis",
							width: "230px",
						}}
						variant="body2"
						color="text.secondary">
						{chat.lastMessage?.audio && (
							<Typography
								color="primary"
								sx={{
									display: "flex",
									alignItems: "center",
									fontSize: "12px",
								}}>
								<MicIcon sx={{ fontSize: "14px" }} />
								Voice message
							</Typography>
						)}
						{chat.lastMessage?.image ? (
							<Typography
								color="primary"
								sx={{
									display: "flex",
									alignItems: "center",
									fontSize: "12px",
								}}>
								<ImageIcon sx={{ fontSize: "14px" }} />
								Image
							</Typography>
						) : (
							chat.lastMessage?.text
						)}
					</Typography>
				</Box>
			</Box>

			{/* <Badge badgeContent={3} color="primary" /> */}
		</Box>
	);
}

export default ChatItem;
