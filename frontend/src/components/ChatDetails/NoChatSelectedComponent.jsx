import { Typography, Box } from "@mui/material";
import { Chat } from "@mui/icons-material";

export default function NoChatSelectedComponent() {
	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			width="100%"
			height="100vh"
			borderRadius={0}>
			<Box textAlign="center">
				<Chat color="primary" sx={{ fontSize: 72 }} />
				<Typography variant="h5" fontWeight="bold">
					HaqSapp for you!
				</Typography>
				<Typography>
					Send and receive messages without keeping your phone online.
				</Typography>
				<Typography>
					Use <strong>HaqSapp</strong> on up to 4 linked devices and one phone
					at the same time.
				</Typography>
			</Box>
		</Box>
	);
}
