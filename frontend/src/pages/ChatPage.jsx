import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import ChatSide from "../components/ChatSide";
import NoUserSelectedComponent from "../components/NoUserSelectedComponent";
import SingleChat from "../components/ChatContainer";
import Sidebar from "../components/Sidebar";

import { useChatStore } from "../store/useChatStore";

const ChatPage = () => {
	const { selectedUser } = useChatStore();
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
		<div style={{ display: "flex" }}>
			<Sidebar />
			<Box display="flex" flex={1}>
				<ChatSide />
				{selectedUser ? <SingleChat /> : <NoUserSelectedComponent />}
			</Box>
		</div>
		// <Box display="flex" height="100vh">
		// 	<Sidebar />
		// 	<Box flex={1} display="flex" flexDirection="column">
		// 		<Card
		// 			sx={{
		// 				height: "100vh",
		// 				display: "flex",
		// 				flexDirection: "column",
		// 			}}>
		//

		// 				<Box flex={1} display="flex" flexDirection="column">
		// 					<TopNav />
		// 					<SingleChat />
		// 				</Box>
		// 		</Card>
		// 	</Box>
		// </Box>
	);
};

export default ChatPage;
