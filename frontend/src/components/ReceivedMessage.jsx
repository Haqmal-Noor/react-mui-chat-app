import { Avatar, Box, Typography, Paper } from "@mui/material";
import AudioPlayer from "./AudioPlayer";

function ReceivedMessage({ receivedMessage }) {
	return (
		<Box display="flex" alignItems="center" width={1} maxWidth={{ md: "50%" }}>
			<Avatar
				src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
				alt="avatar"
				sx={{ width: 48, height: 48, mr: 2 }}
			/>
			<Box sx={{ mb: 2 }}>
				{receivedMessage.format === "audio/webm" ? (
					receivedMessage.content === "based64" ? (
						<AudioPlayer src={receivedMessage.audio} />
					) : (
						<AudioPlayer src={receivedMessage.content} />
					)
				) : (
					<Paper
						sx={{
							p: 2,
							backgroundColor: "grey.200",
							borderRadius: 2,
							maxWidth: "100%",
						}}>
						<Typography variant="body2">{receivedMessage.content}</Typography>
					</Paper>
				)}
				<Typography variant="caption" color="textSecondary">
					{receivedMessage.createdAt
						? new Date(receivedMessage.createdAt).toLocaleTimeString("en-US", {
								hour: "numeric",
								minute: "numeric",
								hour12: true,
						  })
						: receivedMessage.timestamp}
				</Typography>
			</Box>
		</Box>
	);
}

export default ReceivedMessage;
