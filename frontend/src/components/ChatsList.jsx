import { useNavigate } from "react-router-dom";

import ChatItem from "./ChatItem";
import { useChatStore } from "../store/useChatStore";

import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";

export default function ChatsList({ chats }) {
	const { setSelectedChat, selectedChat } = useChatStore();
	const theme = useTheme();
	const navigate = useNavigate();

	const handleChatClick = (chat) => {
		setSelectedChat(chat);
		navigate(`/chats/${chat._id}`); // ✅ navigate to chat detail
	};

	return (
		<Box>
			{chats.map((chat) => (
				<Box
					key={chat._id}
					onClick={() => handleChatClick(chat)}
					sx={{
						cursor: "pointer",
						marginTop: "5px",
						borderRadius: "4px",
						backgroundColor:
							selectedChat?._id === chat._id
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
