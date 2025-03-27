import { Avatar, Badge, Box, Typography } from "@mui/material";

function UserItem({ user }) {
	return (
		<Box
			component="a"
			href="#!"
			sx={{
				display: "flex",
				width: "100%",
				justifyContent: "space-around",
				textDecoration: "none",
				color: "inherit",
				py: 1,
				borderRadius: 1,
				"&:hover": { backgroundColor: "action.hover" },
			}}>
			<Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
				<Box sx={{ position: "relative", mr: 2 }}>
					<Badge
						variant="dot"
						color="primary"
						overlap="circular"
						anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
						<Avatar src={user.profilePic} />
					</Badge>
				</Box>
				<Box>
					<Typography variant="subtitle1" fontWeight="bold">
						{user.username}
					</Typography>
					<Typography variant="body2" color="text.secondary">
						Hello, Are you there?
					</Typography>
				</Box>
			</Box>
			<Box textAlign="right">
				<Typography variant="caption" color="text.secondary" display="block">
					Just now
				</Typography>
				<Badge badgeContent={3} color="primary" />
			</Box>
		</Box>
	);
}

export default UserItem;
