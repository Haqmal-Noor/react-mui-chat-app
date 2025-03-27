import { Box, Avatar, IconButton, Typography, Stack } from "@mui/material";
import { VideoCall, Call, Search } from "@mui/icons-material";

import { useChatStore } from "../store/useChatStore";

const TopNav = () => {
	const { selectedUser } = useChatStore();
	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="space-between"
			px={2}
			py={1}>
			<Stack direction="row" spacing={2} alignItems="center">
				<Avatar src={selectedUser.profilePic} />
				<Box>
					<Typography variant="h7" fontWeight="bold">
						{selectedUser.username}
					</Typography>
					<Typography variant="body2" color="primary">
						Online
					</Typography>
				</Box>
			</Stack>
			<Stack direction="row" spacing={2}>
				<IconButton color="primary">
					<VideoCall />
				</IconButton>
				<IconButton color="primary">
					<Call />
				</IconButton>
				<IconButton color="secondary">
					<Search />
				</IconButton>
			</Stack>
		</Box>
	);
};
export default TopNav;
