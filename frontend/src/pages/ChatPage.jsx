import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
	Box,
	Card,
	Avatar,
	IconButton,
	Typography,
	Button,
	Stack,
} from "@mui/material";
import { VideoCall, Call, Search } from "@mui/icons-material";
import ChatSide from "../components/ChatSide";
import SingleChat from "../components/SingleChat";
import Sidebar from "../components/Sidebar";
import socket from "../services/socket";
import TopNav from "../components/TopNav";
import { useAuthStore } from "../store/useAuthStore";

const ChatPage = () => {
	const { authUser } = useAuthStore();
	console.log(authUser);
	// const [user, setUser] = useState("");
	// const [messages, setMessages] = useState([]);
	// const [receiver, setReceiver] = useState(null);
	// const [onlineUsers, setOnlineUsers] = useState([]);
	// const navigate = useNavigate();

	// useEffect(() => {
	// 	const token = localStorage.getItem("token");
	// 	if (!token) {
	// 		navigate("/login");
	// 		return;
	// 	}
	// 	const fetchUser = async () => {
	// 		try {
	// 			const response = await fetch("http://localhost:5000/api/auth/profile", {
	// 				headers: { Authorization: `Bearer ${token}` },
	// 			});
	// 			const data = await response.json();
	// 			setUser(data);
	// 		} catch (error) {
	// 			console.error(error);
	// 			navigate("/login");
	// 		}
	// 	};
	// 	fetchUser();
	// }, [navigate]);

	// useEffect(() => {
	// 	if (user && user.username) {
	// 		socket.emit("user-connected", user.username);
	// 		socket.on("messages-delivered", (updatedMessages) => {
	// 			setMessages(updatedMessages);
	// 		});
	// 	}
	// }, [user]);

	// useEffect(() => {
	// 	if (!receiver) return;
	// 	const fetchMessages = async () => {
	// 		try {
	// 			const response = await fetch(
	// 				`http://localhost:5000/api/chat/${receiver}`,
	// 				{
	// 					headers: {
	// 						Authorization: `Bearer ${localStorage.getItem("token")}`,
	// 					},
	// 				}
	// 			);
	// 			const data = await response.json();
	// 			setMessages(data);
	// 		} catch (error) {
	// 			console.log(error);
	// 		}
	// 	};
	// 	fetchMessages();
	// }, [receiver]);

	return (
		<div>Chat Page</div>
		// <Box display="flex" height="100vh">
		// 	<Sidebar />
		// 	<Box flex={1} display="flex" flexDirection="column">
		// 		<Card
		// 			sx={{
		// 				height: "100vh",
		// 				display: "flex",
		// 				flexDirection: "column",
		// 			}}>
		// 			<Box display="flex" flex={1}>
		// 				<ChatSide />
		// 				{/* <Box
		// 						display="flex"
		// 						justifyContent="center"
		// 						alignItems="center"
		// 						width="100%"
		// 						height="100vh"
		// 						borderRadius={0}>
		// 						<Box textAlign="center">
		// 							<Typography variant="h5" fontWeight="bold">
		// 								HaqSapp for you!
		// 							</Typography>
		// 							<Typography>
		// 								Send and receive messages without keeping your phone online.
		// 							</Typography>
		// 							<Typography>
		// 								Use <strong>HaqSapp</strong> on up to 4 linked devices and
		// 								one phone at the same time.
		// 							</Typography>
		// 						</Box>
		// 					</Box> */}

		// 				<Box flex={1} display="flex" flexDirection="column">
		// 					<TopNav />
		// 					<SingleChat />
		// 				</Box>
		// 			</Box>
		// 		</Card>
		// 	</Box>
		// </Box>
	);
};

export default ChatPage;
