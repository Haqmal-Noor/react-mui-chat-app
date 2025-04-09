import { useState } from "react";
import { useChatStore } from "../store/useChatStore";

import {
	Typography,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
	useMediaQuery,
} from "@mui/material";
import {
	FilterList,
	Mail,
	Star,
	Contacts,
	PersonOff,
	Group,
	Drafts,
	Search,
} from "@mui/icons-material";

import SearchableDropdown from "./contactSearch";
import SearchBar from "./SearchBar";

export default function SidebarHeader() {
	const { contacts } = useChatStore();

	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm")); // Set your breakpoint

	return (
		<div
			style={{
				marginBottom: "30px",
				paddingBottom: "10px",
				borderBottom: isSmallScreen ? "1px solid white" : "",
			}}>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Typography variant="h5" fontWeight={600}>
					{isSmallScreen ? "HaqSapp" : "Chats"}
				</Typography>
				<div style={{ display: "flex" }}>
					<SearchableDropdown contacts={contacts} />
					<IconButton onClick={handleMenu} color="primary">
						<FilterList />
					</IconButton>
					{/* <IconButton color="primary">
					</IconButton> */}
				</div>

				<Menu
					open={open}
					onClose={handleClose}
					anchorEl={anchorEl}
					PaperProps={{
						sx: { width: 200 },
					}}>
					<Typography
						variant="subtitle1"
						sx={{ padding: "8px 16px", fontWeight: "bold" }}>
						Filters chats by
					</Typography>
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							<Mail />
						</ListItemIcon>
						Unread
					</MenuItem>
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							<Star />
						</ListItemIcon>
						Favorites
					</MenuItem>

					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							<Contacts />
						</ListItemIcon>
						Contacts
					</MenuItem>
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							<PersonOff />
						</ListItemIcon>
						Non-Contacts
					</MenuItem>
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							<Group />
						</ListItemIcon>
						Groups
					</MenuItem>
					<MenuItem onClick={handleClose}>
						<ListItemIcon>
							<Drafts />
						</ListItemIcon>
						Drafts
					</MenuItem>
				</Menu>
			</div>
			{/* <SearchBar /> */}
		</div>
	);
}
