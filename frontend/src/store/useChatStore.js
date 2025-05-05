import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { base64ToBlob } from "../lib/base64ToBlob";

import { useAuthStore } from "./useAuthStore";
import { playSoundWithWebAudio } from "../utils/playSound";

export const useChatStore = create((set, get) => ({
	messages: [],
	hasMore: true,
	chats: [],
	contacts: [],
	selectedChat: null,
	isChatsLoading: false,
	isMessagesLoading: false,
	isFetchingMore: false,
	isSendingMessage: false,
	isSearchingContacts: false,

	createNewChat: async (chatParticipants) => {
		const { setSelectedChat, chats } = get();

		try {
			set({ isSearchingContacts: true });
			const response = await axiosInstance.post("/chats", {
				participants: chatParticipants,
			});
			const newChat = response.data;
			set({ isSearchingContacts: false });
			set({ chats: [...chats, newChat] });
			setSelectedChat(response.data);
			return response.data;
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
		} finally {
			set({ isSearchingContacts: true });
		}
	},

	getChats: async () => {
		set({ isChatsLoading: true });
		try {
			const response = await axiosInstance.get("/chats");
			set({ chats: response.data });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isChatsLoading: false });
		}
	},
	getMessages: async (chatId, before, append = false) => {
		if (!append) {
			set({ isMessagesLoading: true });
		} else {
			set({ isFetchingMore: true });
		}

		try {
			const response = await axiosInstance.get(`/messages/${chatId}`, {
				params: before ? { before } : {},
			});

			const newMessages = response.data.map((message) => ({
				...message,
				audio: message.audio ? "data:audio/mp3;base64," + message.audio : "",
			}));

			set((state) => {
				if (append) {
					// Deduplicate by _id
					const existingIds = new Set(state.messages.map((m) => m._id));
					const filteredNewMessages = newMessages.filter(
						(m) => !existingIds.has(m._id)
					);

					return {
						messages: [...filteredNewMessages, ...state.messages],
						hasMore: newMessages.length > 0,
					};
				} else {
					return {
						messages: newMessages,
						hasMore: newMessages.length > 0,
					};
				}
			});
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load messages");
		} finally {
			set({ isMessagesLoading: false, isFetchingMore: false });
		}
	},

	sendMessage: async (messageData) => {
		set({ isSendingMessage: true });
		const { selectedChat } = get();
		try {
			await axiosInstance.post(
				`/messages/send/${selectedChat._id}`,
				messageData
			);
		} catch (error) {
			console.log(error);
			toast.error("something went wrong!");
		} finally {
			set({ isSendingMessage: false });
		}
	},

	subscribeToMessages: () => {
		const { selectedChat } = get();
		const socket = useAuthStore.getState().socket;
		const authUser = useAuthStore.getState().authUser;

		if (!socket) return;

		socket.on("newMessage", async (newMessage) => {
			if (newMessage.chatId !== selectedChat?._id) return;

			if (newMessage.audio) {
				const audioBlob = base64ToBlob(newMessage.audio, "audio/mp3");
				newMessage.audio = URL.createObjectURL(audioBlob);
			}

			set((state) => {
				const alreadyExists = state.messages.some(
					(msg) => msg._id === newMessage._id
				);
				if (!alreadyExists) {
					if (newMessage.senderId !== authUser._id) {
						playSoundWithWebAudio("/sounds/received-message.mp3");
					}
					return {
						messages: [...state.messages, newMessage],
					};
				}
				return {};
			});
		});

		// Incoming read receipt
		socket.on("messageSeen", ({ messageId, seenAt }) => {
			const current = get().messages;
			const alreadySeen = current.find(
				(msg) => msg._id === messageId && msg.seenAt === seenAt
			);

			if (alreadySeen) return;

			set((state) => ({
				messages: state.messages.map((msg) =>
					msg._id === messageId ? { ...msg, seenAt } : msg
				),
			}));
		});

		socket.on("notification", (data) => {
			if (!selectedChat || selectedChat._id !== data.chatId) {
				playSoundWithWebAudio("/sounds/received-message.mp3");
				toast.info(data.message || "📩 New message received");
			}
		});
	},

	unsubscribeFromMessages: () => {
		const socket = useAuthStore.getState().socket;
		socket.off("newMessage");
		socket.off("messageSeen");
		socket.off("notification");
	},

	setSelectedChat: (selectedChat) => {
		if (!selectedChat) {
			set({ selectedChat: null });
		}
		const socket = useAuthStore.getState().socket;

		socket.emit("joinChat", selectedChat._id);
		set({ selectedChat: selectedChat });
	},

	getChatById: async (chatId) => {
		try {
			const response = await axiosInstance.get(`/chats/${chatId}`);
			const chat = response.data;
			set({ selectedChat: chat });

			// Join chat room via socket
			const socket = useAuthStore.getState().socket;
			socket.emit("joinChat", chat._id);
		} catch (error) {
			console.error("Failed to fetch chat by ID:", error);
			toast.error(error?.response?.data?.message || "Failed to fetch chat");
		}
	},
	handleTyping: (() => {
		let typingTimeout;

		return ({ roomId, userId }) => {
			const socket = useAuthStore.getState().socket;

			if (!socket || !roomId || !userId) return;

			socket.emit("typing", {
				room: roomId,
				userId,
			});

			if (typingTimeout) clearTimeout(typingTimeout);

			typingTimeout = setTimeout(() => {
				socket.emit("stopTyping", {
					room: roomId,
					userId,
				});
			}, 1000);
		};
	})(),
	listenToTypingStatus: (receiverId, setIsTyping) => {
		const socket = useAuthStore.getState().socket;

		if (!socket || !receiverId || !setIsTyping) return;

		const handleTyping = ({ userId }) => {
			if (userId === receiverId) {
				setIsTyping(true);
			}
		};

		const handleStopTyping = ({ userId }) => {
			if (userId === receiverId) {
				setIsTyping(false);
			}
		};

		socket.on("typing", handleTyping);
		socket.on("stopTyping", handleStopTyping);

		// Return an unsubscribe function
		return () => {
			socket.off("typing", handleTyping);
			socket.off("stopTyping", handleStopTyping);
		};
	},
}));
