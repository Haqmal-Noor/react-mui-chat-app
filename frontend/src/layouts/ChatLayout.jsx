// layouts/ChatLayout.jsx
import React from "react";
import Sidebar from "../components/ChatSidebar/Sidebar";
import ChatSide from "../components/ChatSidebar/ChatSide";
import { Outlet } from "react-router-dom";

const ChatLayout = () => {
	return (
		<div style={{ display: "flex", height: "100vh" }}>
			<Sidebar />
			<ChatSide />
			<main style={{ flex: 1, overflowY: "auto" }}>
				<Outlet />
			</main>
		</div>
	);
};

export default ChatLayout;
