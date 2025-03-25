import {
	Box,
	Typography,
	Paper,
	Menu,
	MenuItem,
	Divider,
	ListItemIcon,
} from "@mui/material";
import {
	Check,
	DoneAll,
	Reply,
	Star,
	PushPin,
	Delete,
	CheckBox,
	Info,
} from "@mui/icons-material";

import AudioPlayer from "./AudioPlayer";
import { useState } from "react";

function SentMessage({ sentMessage }) {
	const [menuPosition, setMenuPosition] = useState(null);

	const handleContextmenu = (event) => {
		event.preventDefault();
		setMenuPosition(
			menuPosition === null
				? { mouseX: event.clientX, mouseY: event.clientY }
				: null
		);
	};
	const handleClose = () => {
		setMenuPosition(null);
	};
	return (
		<div>
			<Box display="flex" justifyContent="end" width="100%">
				<Box maxWidth="50%">
					<div style={{ cursor: "pointer" }} onContextMenu={handleContextmenu}>
						{sentMessage.format === "audio/webm" ? (
							<AudioPlayer
								src={
									sentMessage.content === "based64"
										? sentMessage.audio
										: sentMessage.content
								}
							/>
						) : (
							<Paper
								sx={{
									padding: 2,
									marginBottom: 1,
									backgroundColor: "primary.main",
									color: "white",
									whiteSpace: "pre-line",
								}}>
								<Typography variant="body2">{sentMessage.content}</Typography>
							</Paper>
						)}
					</div>
					<Box
						display="flex"
						justifyContent="space-between"
						alignItems="center">
						<Typography variant="caption" color="text.secondary">
							{sentMessage.createdAt
								? new Date(sentMessage.createdAt).toLocaleTimeString("en-US", {
										hour: "numeric",
										minute: "numeric",
										hour12: true,
									})
								: sentMessage.timestamp}
						</Typography>
						{sentMessage.delivered ? (
							sentMessage.seen ? (
								<DoneAll color="primary" />
							) : (
								<DoneAll />
							)
						) : (
							<Check />
						)}
					</Box>
				</Box>
			</Box>
			<Menu
				open={menuPosition !== null}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={
					menuPosition !== null
						? { top: menuPosition.mouseY, left: menuPosition.mouseX }
						: undefined
				}
				PaperProps={{
					sx: { width: 200 },
				}}>
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<Reply />
					</ListItemIcon>
					Reply
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<Star />
					</ListItemIcon>
					Star
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<PushPin />
					</ListItemIcon>
					Pin
				</MenuItem>
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<Delete />
					</ListItemIcon>
					Delete
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<CheckBox />
					</ListItemIcon>
					Select
				</MenuItem>
				<Divider />
				<MenuItem onClick={handleClose}>
					<ListItemIcon>
						<Info />
					</ListItemIcon>
					Info
				</MenuItem>
			</Menu>
		</div>
	);
}

export default SentMessage;
