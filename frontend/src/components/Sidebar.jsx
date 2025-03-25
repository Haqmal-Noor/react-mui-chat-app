import { Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ChatIcon from "@mui/icons-material/Chat";
import CallIcon from "@mui/icons-material/Call";
import StarIcon from "@mui/icons-material/Star";
import ArchiveIcon from "@mui/icons-material/Archive";
import SettingsIcon from "@mui/icons-material/Settings";

function Sidebar() {
	return (
		<Box
			sx={{
				width: 45,
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				alignItems: "center",
				bgcolor: "primary.main",
				height: "100vh",
				py: 2,
			}}>
			<Box color={"white"} display="flex" flexDirection="column" gap={2}>
				<IconButton color="inherit">
					<MenuIcon />
				</IconButton>
				<IconButton color="inherit">
					<ChatIcon />
				</IconButton>
				<IconButton color="inherit">
					<CallIcon />
				</IconButton>
			</Box>
			<Box display="flex" color={"white"} flexDirection="column" gap={2}>
				<IconButton color="inherit">
					<StarIcon />
				</IconButton>
				<IconButton color="inherit">
					<ArchiveIcon />
				</IconButton>
				<IconButton color="inherit">
					<SettingsIcon />
				</IconButton>
			</Box>
		</Box>
	);
}

export default Sidebar;
