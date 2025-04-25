import React from "react";
import ChatMessage from "./ChatMessage";
import { Stack } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

const ChatMessageList = React.memo(
	({ messages, authUser, selectedChat, isSendingMessage, onImageClick }) => {
		return (
			<AnimatePresence initial={false}>
				{messages.map((message, index) => {
					const isOwnMessage = message.senderId === authUser._id;
					const key = message._id || index;

					return (
						<motion.div
							key={key}
							initial={{
								opacity: 0,
								y: 10,
								scale: isOwnMessage ? 0.95 : 1,
							}}
							animate={{
								opacity: 1,
								y: 0,
								scale: 1,
							}}
							exit={{
								opacity: 0,
								y: -10,
								scale: 0.95,
							}}
							transition={{ duration: 0.3, ease: "easeInOut" }}>
							<Stack
								direction={isOwnMessage ? "row-reverse" : "row"}
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
						</motion.div>
					);
				})}
			</AnimatePresence>
		);
	}
);

export default ChatMessageList;
