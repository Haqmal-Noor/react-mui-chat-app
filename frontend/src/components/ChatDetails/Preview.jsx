import React from "react";
import {
	Avatar,
	Box,
	TextField,
	IconButton,
	Paper,
	Typography,
} from "@mui/material";
import { AttachFile, InsertEmoticon, Send } from "@mui/icons-material";

const messages = [
	{
		sender: "user1",
		text: "Lorem ipsum dolor sit amet...",
		time: "12:00 PM | Aug 13",
	},
	{
		sender: "user2",
		text: "Ut enim ad minim veniam...",
		time: "12:00 PM | Aug 13",
	},
];

const ChatUI = () => {
	return (
		<Box
			sx={{
				maxWidth: 600,
				margin: "auto",
				p: 2,
				bgcolor: "background.paper",
				borderRadius: 2,
			}}>
			<Box sx={{ height: 200, overflowY: "auto", p: 2 }}>
				{messages.map((msg, index) => (
					<Box
						key={index}
						sx={{
							display: "flex",
							justifyContent:
								msg.sender === "user1" ? "flex-start" : "flex-end",
							mb: 2,
						}}>
						{msg.sender === "user1" && (
							<Avatar src=""/>
						)}
						<Paper
							sx={{
								p: 1.5,
								maxWidth: "70%",
								ml: msg.sender === "user1" ? 2 : 0,
								mr: msg.sender === "user2" ? 2 : 0,
								bgcolor: msg.sender === "user1" ? "grey.300" : "primary.main",
								color: msg.sender === "user1" ? "black" : "white",
								borderRadius: 2,
							}}>
							<Typography variant="body2">{msg.text}</Typography>
						</Paper>
						{msg.sender === "user2" && (
							<Avatar src="" />
						)}
					</Box>
				))}
			</Box>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					p: 1,
					bgcolor: "grey.100",
					borderRadius: 2,
				}}>
				<Avatar
					src=""
					sx={{ width: 40, height: 40, mr: 1 }}
				/>
				<TextField
					fullWidth
					variant="outlined"
					placeholder="Type message"
					size="small"
				/>
				<IconButton color="primary">
					<AttachFile />
				</IconButton>
				<IconButton color="primary">
					<InsertEmoticon />
				</IconButton>
				<IconButton color="primary">
					<Send />
				</IconButton>
			</Box>
		</Box>
	);
};

export default ChatUI;
