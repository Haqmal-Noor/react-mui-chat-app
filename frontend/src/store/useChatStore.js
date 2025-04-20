import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { base64ToBlob } from "../lib/base64ToBlob";

import { useAuthStore } from "./useAuthStore";

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

	createNewChat: async (chatParticipants) => {
		const { setSelectedChat, chats } = get();

		try {
			const response = await axiosInstance.post("/chats", {
				participants: chatParticipants,
			});
			const newChat = response.data;
			set({ chats: [...chats, newChat] });
			setSelectedChat(response.data);
		} catch (error) {
			console.log(error);
			toast.error(error.response.data.message);
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
		if (!selectedChat) return;

		const socket = useAuthStore.getState().socket;
		// const userId = useAuthStore.getState().authUser._id;

		socket.on("newMessage", async (newMessage) => {
			if (newMessage.chatId !== selectedChat._id) return;

			if (newMessage.audio) {
				const audioBlob = base64ToBlob(newMessage.audio, "audio/mp3");
				newMessage.audio = URL.createObjectURL(audioBlob);
			}

			set((state) => {
				if (newMessage.chatId !== state.selectedChat?._id) return {};

				const alreadyExists = state.messages.some(
					(msg) => msg._id === newMessage._id
				);

				if (!alreadyExists) {
					return {
						messages: [...state.messages, newMessage],
					};
				}

				return {};
			});
		});
	},

	unsubscribeFromMessages: () => {
		const socket = useAuthStore.getState().socket;
		socket.off("newMessage");
	},
	setSelectedChat: (selectedChat) => {
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
}));
