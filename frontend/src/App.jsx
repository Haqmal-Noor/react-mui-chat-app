import React, { useEffect, useState } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { themes } from "./theme/theme.js";
import { useAuthStore } from "./store/useAuthStore.js";
import { ToastContainer } from "react-toastify";
import { CssBaseline } from "@mui/material";
import { GlobalStyles } from "@mui/material";

// layouts
import MainLayout from "./layouts/MainLayout.jsx";
import ChatLayout from "./layouts/ChatLayout.jsx";
// components
import Loader from "./components/Loaders/Loader.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import ChatDetailsPage from "./pages/ChatDetailsPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import HomePage from "./pages/HomePage.jsx";

function App() {
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

	// Get the saved theme from localStorage or set to default darkTheme1
	const savedTheme = localStorage.getItem("theme") || "darkTheme1";
	const [currentTheme, setCurrentTheme] = useState(savedTheme);

	useEffect(() => {
		localStorage.setItem("theme", currentTheme); // Save the theme to localStorage
	}, [currentTheme]);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth && !authUser) {
		return <Loader size={60} />;
	}

	return (
		<ThemeProvider theme={themes[currentTheme] || themes["darkTheme1"]}>
			<CssBaseline />
			<GlobalStyles
				styles={{
					body: {
						backgroundColor:
							themes[currentTheme]?.palette.background.default ||
							themes["darkTheme1"].palette.background.default,
						color:
							themes[currentTheme]?.palette.text.primary ||
							themes["darkTheme1"].palette.text.primary,
						transition: "background-color 0.3s ease",
					},
				}}
			/>
			<Router>
				<Routes>
					<Route path="/" element={<HomePage />} />
					{/* Chat routes with Sidebar + ChatSide */}
					<Route element={authUser ? <ChatLayout /> : <Navigate to="/login" />}>
						<Route path="/chats" element={<ChatPage />} />
						<Route path="/chats/:id" element={<ChatDetailsPage />} />
					</Route>

					{/* General pages with Sidebar only */}
					<Route element={authUser ? <MainLayout /> : <Navigate to="/login" />}>
						<Route
							path="/settings"
							element={
								<SettingsPage
									currentTheme={currentTheme}
									setCurrentTheme={setCurrentTheme}
								/>
							}
						/>
						<Route path="/profile" element={<ProfilePage />} />
					</Route>

					{/* No-sidebar pages */}
					<Route
						path="/login"
						element={!authUser ? <LoginPage /> : <Navigate to="/chats" />}
					/>
					<Route
						path="/register"
						element={!authUser ? <RegisterPage /> : <Navigate to="/chats" />}
					/>
				</Routes>
			</Router>
			<ToastContainer />
		</ThemeProvider>
	);
}

export default App;
