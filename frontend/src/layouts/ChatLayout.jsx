import React from "react";
import Sidebar from "../components/ChatSidebar/Sidebar";
import ChatSide from "../components/ChatSidebar/ChatSide";
import { useMediaQuery } from "@mui/system";
import { Outlet, useLocation } from "react-router-dom";
import MobileNavigation from "../components/MobileNavigation";

const ChatLayout = () => {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
	const location = useLocation();

	// Check if on ChatDetailsPage route
	const isChatDetailsPage = /^\/chats\/[^/]+$/.test(location.pathname);

	// Condition to hide sidebars
	const hideSidebars = isSmallScreen && isChatDetailsPage;

	return (
		<div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
			<div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
				{!isSmallScreen && <Sidebar />}
				{!hideSidebars && <ChatSide />}
				<main style={{ flex: 1, overflowY: "auto" }}>
					<Outlet />
				</main>
			</div>
			{isSmallScreen && !isChatDetailsPage && (
				<div
					style={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1000 }}>
					<MobileNavigation />
				</div>
			)}
		</div>
	);
};

export default ChatLayout;
