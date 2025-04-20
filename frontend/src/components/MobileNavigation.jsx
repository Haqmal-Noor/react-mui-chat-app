import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// import { useAuthStore } from "../store/useAuthStore";

import { Box, BottomNavigation, BottomNavigationAction } from "@mui/material";
import { Chat, Settings, AccountCircle } from "@mui/icons-material";

// import LogoutButton from "./Logout";

export default function MobileNavigation() {
	const location = useLocation();
	const navigate = useNavigate();

	// const { logout } = useAuthStore();

	const [value, setValue] = useState(0);

	// Map routes to index
	const routes = ["/chats", "/profile", "/settings"];

	// Update value when location changes
	useEffect(() => {
		const index = routes.findIndex((route) =>
			location.pathname.startsWith(route)
		);
		if (index !== -1) setValue(index);
	}, [location.pathname]);

	const handleChange = (event, newValue) => {
		setValue(newValue);
		navigate(routes[newValue]);
	};

	return (
		<Box sx={{ width: "100%", bgcolor: "background.paper" }}>
			<BottomNavigation value={value} onChange={handleChange} showLabels>
				<BottomNavigationAction label="Chats" icon={<Chat />} />
				<BottomNavigationAction label="Profile" icon={<AccountCircle />} />
				<BottomNavigationAction label="Settings" icon={<Settings />} />
			</BottomNavigation>
		</Box>
	);
}
