import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { Box } from "@mui/material";

export default function Navbar() {
	const [auth, setAuth] = useState(true);

	return (
		<AppBar
			position="static"
			sx={{ backgroundColor: "#1e1e2f", color: "#ffffff" }}>
			<Toolbar>
				<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Photos
				</Typography>
				{auth && (
					<Box display="flex" gap={2}>
						<IconButton size="large" color="inherit">
							<Settings />
						</IconButton>
						<IconButton size="large" color="inherit">
							<Logout />
						</IconButton>
						<IconButton size="large" color="inherit">
							<AccountCircle />
						</IconButton>
					</Box>
				)}
			</Toolbar>
		</AppBar>
	);
}
