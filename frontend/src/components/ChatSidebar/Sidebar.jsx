import { useAuthStore } from "../../store/useAuthStore";
import { useNavigate } from "react-router-dom";

import { Box, IconButton } from "@mui/material";

import { Chat, Call, Settings, AccountCircle } from "@mui/icons-material";

import LogoutButton from "../Logout";
import { useChatStore } from "../../store/useChatStore";

function Sidebar() {
	const { logout } = useAuthStore();
	const { setSelectedChat } = useChatStore();
	const navigate = useNavigate();

	const handleChatsClick = () => {
		setSelectedChat({});
		navigate("/chats");
	};

	return (
		<Box
			sx={{
				width: 45,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				bgcolor: "primary.main",
				height: "100vh",
				py: 2,
			}}>
			<Box color={"white"} display="flex" flexDirection="column" gap={2}>
				<IconButton onClick={handleChatsClick} color="inherit">
					<Chat />
				</IconButton>
				<IconButton color="inherit">
					<Call />
				</IconButton>
			</Box>
			<Box display="flex" color={"white"} flexDirection="column" gap={2}>
				<IconButton onClick={() => navigate("/profile")} color="inherit">
					<AccountCircle />
				</IconButton>

				<LogoutButton onLogout={logout} />

				<IconButton onClick={() => navigate("/settings")} color="inherit">
					<Settings />
				</IconButton>
			</Box>
		</Box>
	);
}

export default Sidebar;
