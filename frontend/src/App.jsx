import "./../public/css/mdb.min.css";
import "./../public/js/mdb.umd.min.js";

import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/theme.js";
import { useAuthStore } from "./store/useAuthStore.js";
import { ToastContainer } from "react-toastify";

import Loader from "./components/Loader.jsx";
import Navbar from "./components/Navbar.jsx";

import ChatPage from "./pages/ChatPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

function App() {
	const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
	console.log(authUser);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	if (isCheckingAuth && !authUser) {
		return <Loader />;
	}
	return (
		<ThemeProvider theme={theme}>
			<Navbar />
			<Router>
				<Routes>
					<Route
						path="/"
						element={authUser ? <ChatPage /> : <Navigate to="/login" />}
					/>
					<Route
						path="/register"
						element={!authUser ? <RegisterPage /> : <Navigate to="/" />}
					/>
					<Route
						path="/login"
						element={!authUser ? <LoginPage /> : <Navigate to="/" />}
					/>
					<Route
						path="/profile"
						element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
					/>
					<Route path="/settings" element={<SettingsPage />} />
				</Routes>
			</Router>
			<ToastContainer />
		</ThemeProvider>
	);
}
export default App;
