import { useState, useRef, useEffect } from "react";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import TopNav from "../components/TopNav";
import ChatSkeleton from "../components/ChatSkeleton";
import TransferMessageInput from "../components/TransferMessageInput";
import AudioPlayer from "../components/AudioPlayer";

import {
	Box,
	Avatar,
	Typography,
	Card,
	CardMedia,
	Stack,
	Modal,
} from "@mui/material";
import { Check } from "@mui/icons-material";

import { format } from "date-fns";
import { useParams } from "react-router-dom";

function ChatDetailsPage() {
	const { id } = useParams();
	const messagesRef = useRef(null);

	const { authUser } = useAuthStore();
	const {
		messages,
		getMessages,
		isMessagesLoading,
		selectedChat,
		getChatById,
		subscribeToMessages,
		unsubscribeFromMessages,
	} = useChatStore();

	const [openModal, setOpenModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState("");

	// Fetch the chat by ID when the component mounts or the ID changes
	useEffect(() => {
		if (id) {
			getChatById(id);
		}
	}, [id, getChatById]);

	// Fetch messages and set up subscription when selectedChat updates
	useEffect(() => {
		if (selectedChat?._id) {
			getMessages(selectedChat._id);
			subscribeToMessages();
			return () => unsubscribeFromMessages();
		}
	}, [selectedChat, getMessages, subscribeToMessages, unsubscribeFromMessages]);

	// Scroll to bottom when messages change
	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

	// Modal controls
	const handleOpenModal = (image) => {
		setSelectedImage(image);
		setOpenModal(true);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	if (isMessagesLoading || !selectedChat) return <ChatSkeleton />;

	return (
		<div
			style={{
				width: "100%",
				height: "100vh",
				display: "flex",
				flexDirection: "column",
			}}>
			<TopNav />
			<Box
				ref={messagesRef}
				sx={{
					flex: 1,
					overflowY: "auto",
					p: 2,
					display: "flex",
					flexDirection: "column",
					gap: 2,
				}}>
				{messages.map((message, index) => {
					const isSentByCurrentUser = message.senderId === authUser._id;
					return (
						<Stack
							key={message._id || index}
							direction={isSentByCurrentUser ? "row-reverse" : "row"}
							alignItems="flex-end"
							spacing={2}>
							<Avatar
								src={
									isSentByCurrentUser
										? authUser.profilePic
										: selectedChat.participants.find(
												(p) => p._id === message.senderId
											)?.profilePic
								}
							/>
							<Card
								sx={{
									p: 1,
									maxWidth: "60%",
									minWidth: "10%",
									backgroundColor: isSentByCurrentUser
										? "primary.light"
										: "grey.300",
								}}>
								{message.image && (
									<CardMedia
										component="img"
										image={message.image}
										sx={{
											borderRadius: 1,
											mb: 1,
											width: 200,
											height: 200,
											objectFit: "cover",
											cursor: "pointer",
										}}
										alt="Message attachment"
										onClick={() => handleOpenModal(message.image)}
									/>
								)}
								{message.text && (
									<Typography
										variant="h6"
										color={isSentByCurrentUser ? "white" : "black"}>
										{message.text}
									</Typography>
								)}
								{message.audio && <AudioPlayer src={message.audio} />}
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
										marginTop: "7px",
									}}>
									<Typography
										color={isSentByCurrentUser ? "white" : "black"}
										sx={{
											display: "block",
											fontSize: "10px",
											textAlign: isSentByCurrentUser ? "right" : "left",
										}}>
										{format(new Date(message.createdAt), "p")}
									</Typography>
									<Check sx={{ fontSize: "16px" }} />
								</div>
							</Card>
						</Stack>
					);
				})}
			</Box>
			<TransferMessageInput />

			<Modal open={openModal} onClose={handleCloseModal}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						bgcolor: "background.paper",
						boxShadow: 24,
						p: 2,
						outline: "none",
						borderRadius: 2,
					}}>
					<img
						src={selectedImage}
						alt="Enlarged preview"
						style={{ width: "100%", height: "auto", maxWidth: "500px" }}
					/>
				</Box>
			</Modal>
		</div>
	);
}

export default ChatDetailsPage;
