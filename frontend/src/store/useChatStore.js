import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { base64ToBlob } from "../lib/base64ToBlob";

import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
	messages: [],
	chats: [],
	contacts: [],
	selectedChat: null,
	isChatsLoading: false,
	isMessagesLoading: false,
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
	getMessages: async (chatId) => {
		set({ isMessagesLoading: true });
		try {
			const response = await axiosInstance.get(`/messages/${chatId}`);
			const messages = response.data;
			const messagesWithFixedAudioFormat = messages.map((message) => ({
				...message,
				audio: message.audio ? "data:audio/mp3;base64," + message.audio : "",
			}));
			set({ messages: messagesWithFixedAudioFormat || [] });
		} catch (error) {
			toast.error(error.response.data.message);
		} finally {
			set({ isMessagesLoading: false });
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

			const existingMessages = get().messages;

			set({
				messages: [...existingMessages, newMessage],
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
