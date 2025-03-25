import { Box, Avatar, IconButton, Typography, Stack } from "@mui/material";
import { VideoCall, Call, Search } from "@mui/icons-material";
const TopNav = ({ receiver }) => {
	return (
		<Box
			display="flex"
			alignItems="center"
			justifyContent="space-between"
			p={2}
			bgcolor="white"
			boxShadow={1}>
			<Stack direction="row" spacing={2} alignItems="center">
				<Avatar src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp" />
				<Box>
					<Typography variant="h6" fontWeight="bold">
						{receiver}
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
