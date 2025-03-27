import { useState } from "react";

import {
	Typography,
	IconButton,
	Menu,
	MenuItem,
	ListItemIcon,
} from "@mui/material";
import {
	FilterList,
	Mail,
	Star,
	Contacts,
	PersonOff,
	Group,
	Drafts,
} from "@mui/icons-material";

import SearchableDropdown from "./contactSearch";
import SearchBar from "./SearchBar";

export default function SidebarHeader() {
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event) => {
		event.stopPropagation();
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<div>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Typography variant="h5" fontWeight={600}>
					Chats
				</Typography>
				<div style={{ display: "flex" }}>
					<SearchableDropdown
						items={["Banana", "Apple", "Orange", "Bar", "Mango", "Grapes"]}
					/>
					<IconButton onClick={handleMenu} color="primary">
						<FilterList />
					</IconButton>
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
			<SearchBar />
		</div>
	);
}
