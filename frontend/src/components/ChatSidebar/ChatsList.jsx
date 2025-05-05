import { useNavigate } from "react-router-dom";

import ChatItem from "./ChatItem";
import { useAuthStore } from "../../store/useAuthStore";
import { useChatStore } from "../../store/useChatStore";

import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

export default function ChatsList({ chats }) {
	const { getChatById, selectedChat } = useChatStore();
	const { authUser, onlineUsers } = useAuthStore();

	const theme = useTheme();
	const navigate = useNavigate();

	const handleChatClick = (chat) => {
		getChatById(chat._id);
		navigate(`/chats/${chat._id}`); // ✅ navigate to chat detail
	};
	//todo: move the function to a file
	const getReceiver = (chatParticipants, senderId) => {
		return chatParticipants.find((userId) => userId._id !== senderId);
	};
	const isReceiverOnline = (chat) => {
		const receiver = getReceiver(chat.participants, authUser._id);
		return onlineUsers.includes(receiver?._id);
	};

	// Sort chats: online users first
	const sortedChats = chats.sort((a, b) => {
		const aOnline = isReceiverOnline(a);
		const bOnline = isReceiverOnline(b);
		return bOnline === aOnline ? 0 : aOnline ? -1 : 1;
	});

	return (
		<Box>
			{sortedChats.map((chat) => (
				<Box
					key={chat._id}
					onClick={() => handleChatClick(chat)}
					sx={{
						marginTop: "5px",
						borderRadius: "4px",
						backgroundColor:
							selectedChat?._id === chat?._id
								? theme.palette.action.hover
								: "transparent",
						"&:hover": {
							backgroundColor: theme.palette.action.hover,
						},
					}}>
					<ChatItem chat={chat} />
				</Box>
			))}
		</Box>
	);
}
