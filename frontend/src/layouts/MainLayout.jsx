// layouts/MainLayout.jsx
import Sidebar from "../components/ChatSidebar/Sidebar";
import MobileNavigation from "../components/MobileNavigation";
import { Outlet } from "react-router-dom";

import { useMediaQuery } from "@mui/system";

const MainLayout = () => {
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

	return (
		<div style={{ display: "flex", height: "100vh" }}>
			{!isSmallScreen && <Sidebar />}
			<main style={{ flex: 1, padding: "1rem", overflowY: "auto" }}>
				<Outlet />
			</main>
			{isSmallScreen && (
				<div
					style={{ position: "fixed", bottom: 0, width: "100%", zIndex: 1000 }}>
					<MobileNavigation />
				</div>
			)}
		</div>
	);
};

export default MainLayout;
