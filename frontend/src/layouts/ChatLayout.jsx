// layouts/ChatLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import ChatSide from "../components/ChatSide";
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
