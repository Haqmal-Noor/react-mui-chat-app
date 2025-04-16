import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import TopNav from "../components/ChatDetails/TopNav";
import ChatSkeleton from "../components/Loaders/ChatSkeleton";
import TransferMessageInput from "../components/ChatDetails/TransferMessageInput";
import ChatMessageList from "../components/ChatDetails/ChatMessageList";
import ImageModal from "../components/ChatDetails/ImageModal";

import { Box } from "@mui/material";

function ChatDetailsPage() {
	const { id } = useParams();
	const messagesRef = useRef(null);
	const { authUser } = useAuthStore();
	const {
		messages,
		getMessages,
		isMessagesLoading,
		isSendingMessage,
		selectedChat,
		getChatById,
		subscribeToMessages,
		unsubscribeFromMessages,
	} = useChatStore();

	const [openModal, setOpenModal] = useState(false);
	const [selectedImage, setSelectedImage] = useState("");

	const handleOpenModal = (image) => {
		setSelectedImage(image);
		setOpenModal(true);
	};

	const handleCloseModal = () => setOpenModal(false);

	useEffect(() => {
		if (id) getChatById(id);
	}, [id]);

	useEffect(() => {
		if (selectedChat?._id) {
			getMessages(selectedChat._id);
			subscribeToMessages();
			return () => unsubscribeFromMessages();
		}
	}, [selectedChat]);

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, [messages]);

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
				<ChatMessageList
					messages={messages}
					authUser={authUser}
					selectedChat={selectedChat}
					isSendingMessage={isSendingMessage}
					onImageClick={handleOpenModal}
				/>
			</Box>
			<TransferMessageInput />
			<ImageModal
				open={openModal}
				onClose={handleCloseModal}
				image={selectedImage}
			/>
		</div>
	);
}

export default ChatDetailsPage;
