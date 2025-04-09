// layouts/MainLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar"; // Adjust path as needed
import { Outlet } from "react-router-dom";

const MainLayout = () => {
	return (
		<div style={{ display: "flex", height: "100vh" }}>
			<Sidebar />
			<main style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
				<Outlet />
			</main>
		</div>
	);
};

export default MainLayout;
