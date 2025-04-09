import {
	Card,
	CardContent,
	Avatar,
	IconButton,
	Typography,
	Stack,
	Box,
} from "@mui/material";
import { VideoCall, Call, Search } from "@mui/icons-material";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const TopNav = () => {
	const { authUser, onlineUsers } = useAuthStore();

	const { selectedChat } = useChatStore();

	// todo: remove this function and put it in a file
	const getReceiver = (chatParticipants, senderId) => {
		return chatParticipants?.find((userId) => userId._id !== senderId);
	};
	return (
		<Card>
			<CardContent
				sx={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
				}}>
				<Stack direction="row" spacing={2} alignItems="center">
					<Avatar
						src={
							getReceiver(selectedChat.participants, authUser._id).profilePic
						}
					/>
					<Box>
						<Typography variant="subtitle1" fontWeight="bold">
							{getReceiver(selectedChat.participants, authUser._id).username}
						</Typography>
						<Typography
							variant="body2"
							color={
								onlineUsers.includes(selectedChat.participants[1]._id)
									? "primary"
									: "secondary"
							}>
							{onlineUsers.includes(
								getReceiver(selectedChat.participants, authUser._id)._id
							)
								? "Online"
								: "Offline"}
						</Typography>
					</Box>
				</Stack>
				<Stack direction="row" spacing={2}>
					<IconButton color="primary">
						<VideoCall />
					</IconButton>
					<IconButton color="primary">
						<Call />
					</IconButton>
					<IconButton color="secondary">
						<Search />
					</IconButton>
				</Stack>
			</CardContent>
		</Card>
	);
};

export default TopNav;
