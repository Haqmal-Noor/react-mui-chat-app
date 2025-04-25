import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	Card,
	CardContent,
	Avatar,
	IconButton,
	Typography,
	Stack,
	Box,
	useMediaQuery,
} from "@mui/material";
import { VideoCall, Call, Search, ArrowBack } from "@mui/icons-material";

import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

import TypingDots from "./TypingDots";

const TopNav = () => {
	const navigate = useNavigate();

	const { authUser, onlineUsers } = useAuthStore();
	const { selectedChat } = useChatStore();
	const [isTyping, setIsTyping] = useState(false);

	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	const getReceiver = (chatParticipants, senderId) => {
		return chatParticipants?.find((userId) => userId._id !== senderId);
	};

	const receiver = getReceiver(selectedChat.participants, authUser._id);

	useEffect(() => {
		if (!receiver || !selectedChat) return;

		const unsubscribe = useChatStore
			.getState()
			.listenToTypingStatus(receiver._id, setIsTyping);

		return () => {
			if (unsubscribe) unsubscribe();
		};
	}, [receiver, selectedChat]);

	const showStatus = () => {
		if (isTyping) return "Typing...";
		if (onlineUsers.includes(receiver._id)) return "Online";
		return "Offline";
	};
	const handleVoiceCall = () => {
		if (!receiver) return;

		// Emit a "call-user" event or use your WebRTC function
		// For example, using Socket.IO
		useChatStore.getState().initiateVoiceCall(receiver._id);
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
					{isSmallScreen && (
						<IconButton
							sx={{ p: 0.5 }}
							size="small"
							color="primary"
							onClick={() => navigate("/chats")}>
							<ArrowBack />
						</IconButton>
					)}

					<Avatar src={receiver?.profilePic} />
					<Box>
						<Typography variant="subtitle1" fontWeight="bold">
							{receiver?.username}
						</Typography>
						{isTyping ? (
							<Box sx={{ ml: 0.5 }}>
								<TypingDots />
							</Box>
						) : (
							<Typography
								variant="body2"
								color={
									onlineUsers.includes(receiver._id) ? "primary" : "secondary"
								}>
								{showStatus()}
							</Typography>
						)}
					</Box>
				</Stack>
				<Stack direction="row" spacing={2}>
					<IconButton color="primary">
						<VideoCall />
					</IconButton>
					<IconButton color="primary" onClick={handleVoiceCall}>
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
