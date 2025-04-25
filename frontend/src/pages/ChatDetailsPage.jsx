import { useState, useRef, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

import TopNav from "../components/ChatDetails/TopNav";
import ChatSkeleton from "../components/Loaders/ChatSkeleton";
import TransferMessageInput from "../components/ChatDetails/TransferMessageInput";
import ChatMessageList from "../components/ChatDetails/ChatMessageList";
import ImageModal from "../components/ChatDetails/ImageModal";

import Loader from "../components/Loaders/Loader";

import { Box, Typography, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import NoChatSelectedComponent from "../components/ChatDetails/NoChatSelectedComponent";

function ChatDetailsPage() {
	const { id } = useParams();
	const messagesRef = useRef(null);
	const prevMessagesLengthRef = useRef(0);
	const [prevScrollHeight, setPrevScrollHeight] = useState(0);

	const { authUser, socket } = useAuthStore();
	const {
		messages,
		getMessages,
		isMessagesLoading,
		isFetchingMore,
		isSendingMessage,
		selectedChat,
		getChatById,
		subscribeToMessages,
		unsubscribeFromMessages,
		hasMore,
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
	}, [id, getChatById]);

	const isUserAtBottom = useCallback(() => {
		if (!messagesRef.current) return false;
		const { scrollTop, scrollHeight, clientHeight } = messagesRef.current;
		return scrollHeight - scrollTop - clientHeight < 100;
	}, []);

	useEffect(() => {
		if (!socket || !isUserAtBottom()) return;

		console.log(messages.seenAt);

		// Find messages sent by others that we haven't marked as seen yet
		const unseenIds = messages
			.filter((m) => m.senderId !== authUser._id && !m.seenAt)
			.map((m) => m._id);

		if (unseenIds.length > 0) {
			console.log(unseenIds.length);
			socket.emit("seen", {
				chatId: selectedChat._id,
				messageIds: unseenIds,
			});
		}
	}, [messages, isUserAtBottom, socket, selectedChat, authUser]);

	useEffect(() => {
		// Always subscribe when the component mounts or deps change
		subscribeToMessages();

		// If there is a selected chat, fetch messages
		if (selectedChat?._id) {
			getMessages(selectedChat._id);
		}

		// Always unsubscribe when the component unmounts or deps change
		return () => {
			unsubscribeFromMessages();
		};
	}, [selectedChat, getMessages, subscribeToMessages, unsubscribeFromMessages]);

	useEffect(() => {
		if (messagesRef.current && !isMessagesLoading) {
			if (prevScrollHeight) {
				const diff = messagesRef.current.scrollHeight - prevScrollHeight;
				messagesRef.current.scrollTop = diff;
			} else {
				messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
			}
		}
	}, [messages, isMessagesLoading, prevScrollHeight]);

	const handleScroll = useCallback(() => {
		const container = messagesRef.current;
		if (!container || isMessagesLoading) return;

		if (container.scrollTop < 100 && hasMore) {
			setPrevScrollHeight(container.scrollHeight);
			const oldestMessageId = messages[0]?._id;
			if (oldestMessageId && selectedChat?._id) {
				getMessages(selectedChat._id, oldestMessageId, true);
			}
		} else if (isUserAtBottom()) {
			// 👇 Reset scroll height when user scrolls back to bottom
			setPrevScrollHeight(0);
		}
	}, [
		messages,
		isUserAtBottom,
		isMessagesLoading,
		hasMore,
		selectedChat,
		getMessages,
	]);

	// Scroll to bottom on button click
	const scrollToBottom = () => {
		if (messagesRef.current) {
			messagesRef.current.scrollTo({
				top: messagesRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	};

	// Scroll to bottom when a new message is added (not when loading more)
	useEffect(() => {
		if (
			messagesRef.current &&
			messages.length > prevMessagesLengthRef.current
		) {
			const isNewMessage =
				messages.length > 0 &&
				!isMessagesLoading &&
				!isFetchingMore &&
				prevScrollHeight === 0;

			if (isNewMessage) {
				messagesRef.current.scrollTo({
					top: messagesRef.current.scrollHeight,
					behavior: "smooth",
				});
			}
		}

		prevMessagesLengthRef.current = messages.length;
	}, [messages, isMessagesLoading, isFetchingMore, prevScrollHeight]);

	const theme = useTheme();

	if (!id) return <NoChatSelectedComponent />;
	if (isMessagesLoading || !selectedChat) return <ChatSkeleton />;

	return (
		<div
			style={{
				width: "100%",
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				position: "relative",
			}}>
			<TopNav />
			<Box
				ref={messagesRef}
				onScroll={handleScroll}
				sx={{
					flex: 1,
					overflowY: "auto",
					p: 2,
					display: "flex",
					flexDirection: "column",
					gap: 2,
				}}>
				{isFetchingMore && <Loader size={30} />}
				{!hasMore && (
					<Typography sx={{ textAlign: "center" }}>
						No Other Messages to show...
					</Typography>
				)}
				<ChatMessageList
					messages={messages}
					authUser={authUser}
					selectedChat={selectedChat}
					isSendingMessage={isSendingMessage}
					onImageClick={handleOpenModal}
				/>
				<IconButton
					color="primary"
					onClick={scrollToBottom}
					sx={{
						position: "fixed",
						bottom: 100,
						right: 30,
						zIndex: 1000,
						backgroundColor: `${theme.palette.primary.main}`,
						boxShadow: 3,
						"&:hover": {
							backgroundColor: "#f0f0f0",
						},
					}}>
					<KeyboardArrowDownIcon sx={{ color: "white" }} />
				</IconButton>
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
