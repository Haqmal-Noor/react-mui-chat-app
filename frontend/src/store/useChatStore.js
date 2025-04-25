import { create } from "zustand";
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { base64ToBlob } from "../lib/base64ToBlob";

import { useAuthStore } from "./useAuthStore";
import { playSoundWithWebAudio } from "../utils/playSound";

export const useChatStore = create((set, get) => ({
	messages: [],
	unseenMessages: [],
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
		const socket = useAuthStore.getState().socket;
		const authUser = useAuthStore.getState().authUser;

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
			socket.emit("delivered", {
				chatId,
				messageIds: newMessages.map((m) => m._id),
				userId: authUser._id,
			});
		} catch (error) {
			toast.error(error.response?.data?.message || "Failed to load messages");
		} finally {
			set({ isMessagesLoading: false, isFetchingMore: false });
		}
	},

	setUnseenMessagesCountBySender: () => {
		const messages = get().messages;
		const unseenCountMap = new Map();

		messages.forEach((msg) => {
			if (!msg.seenAt) {
				const senderId = msg.senderId.toString(); // Ensure it's stringified for consistency
				unseenCountMap.set(senderId, (unseenCountMap.get(senderId) || 0) + 1);
			}
		});

		set({
			unseenMessages: Array.from(
				unseenCountMap,
				([senderId, unseenMessagesCount]) => ({
					senderId,
					unseenMessagesCount,
				})
			),
		});
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
		const userId = useAuthStore.getState().authUser._id;

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
					if (newMessage.senderId !== userId) {
						playSoundWithWebAudio("/sounds/received-message.mp3");
					}
					return {
						messages: [...state.messages, newMessage],
					};
				}
				return {};
			});
		});

		// Incoming delivery receipt
		socket.on("messageDelivered", ({ messageId, deliveredAt }) => {
			set((state) => ({
				messages: state.messages.map((m) =>
					m._id === messageId ? { ...m, deliveredAt } : m
				),
			}));
		});

		// Incoming read receipt
		socket.on("messageSeen", ({ messageId, seenAt }) => {
			const current = get().messages; // Assuming this gives current messages
			const alreadySeen = current.find(
				(msg) => msg._id === messageId && msg.seenAt === seenAt
			);
			console.log("before seen");

			if (alreadySeen) return; // 💥 Prevent re-updating and breaking the render loop
			console.log("after seen");

			set((state) => ({
				messages: state.messages.map((msg) =>
					msg._id === messageId ? { ...msg, seenAt } : msg
				),
			}));
		});

		// ✅ Handle notification
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
	initiateVoiceCall: (receiverId) => {
		const socket = useAuthStore.getState().socket;

		// Assuming you already have media permissions and peer setup
		navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
			// Set up peer connection and emit offer
			const peerConnection = new RTCPeerConnection({
				iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
			});

			stream
				.getTracks()
				.forEach((track) => peerConnection.addTrack(track, stream));

			peerConnection.onicecandidate = (event) => {
				if (event.candidate) {
					console.log("helllll");

					socket.emit("ice-candidate", {
						to: receiverId,
						candidate: event.candidate,
					});
				}
			};

			peerConnection.createOffer().then((offer) => {
				peerConnection.setLocalDescription(offer);
				socket.emit("call-user", {
					to: receiverId,
					offer,
				});
			});
		});
	},
}));
