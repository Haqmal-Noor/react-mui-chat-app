import { useRef, useEffect } from "react";
import { useChatStore } from "../store/useChatStore";

import TopNav from "./TopNav";
import ChatSkeleton from "./ChatSkeleton";
import TransferMessageInput from "./TransferMessageInput";

function SingleChat() {
	const messagesRef = useRef(null);
	const { messages, getMessages, isMessagesLoading, selectedUser } =
		useChatStore();

	useEffect(() => {
		if (messagesRef.current) {
			messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
		}
	}, []);

	useEffect(() => {
		getMessages(selectedUser._id);
	}, [selectedUser._id, getMessages]);

	if (isMessagesLoading) return <ChatSkeleton />;

	return (
		<div style={{ width: "100%" }}>
			<TopNav />
			<TransferMessageInput />
		</div>
	);
}

export default SingleChat;
