import React from "react";
import ChatMessage from "./ChatMessage";
import { Stack } from "@mui/material";

const ChatMessageList = React.memo(
	({ messages, authUser, selectedChat, isSendingMessage, onImageClick }) => {
		return (
			<>
				{messages.map((message, index) => (
					<Stack
						key={message._id || index}
						direction={
							message.senderId === authUser._id ? "row-reverse" : "row"
						}
						alignItems="flex-end"
						spacing={1}>
						<ChatMessage
							message={message}
							authUser={authUser}
							selectedChat={selectedChat}
							isSendingMessage={isSendingMessage}
							onImageClick={onImageClick}
						/>
					</Stack>
				))}
			</>
		);
	}
);

export default ChatMessageList;
