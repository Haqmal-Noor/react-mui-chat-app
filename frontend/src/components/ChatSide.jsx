import { useState } from "react";
import UserItem from "./UserItem";
import SearchBar from "./SearchBar";
import SearchableDropdown from "./contactSearch";
import {
	Card,
	CardContent,
	Typography,
	IconButton,
	List,
	ListItem,
	Menu,
	MenuItem,
	ListItemIcon,
	Popper,
	TextField,
	Paper,
	Autocomplete,
} from "@mui/material";
import {
	Chat,
	FilterList,
	Mail,
	Star,
	Contacts,
	PersonOff,
	Group,
	Drafts,
} from "@mui/icons-material";
import { useRef } from "react";

function ChatSide() {
	const [width, setWidth] = useState(420); // Initial width of the card
	const resizableRef = useRef(null); // Ref to the resizable area

	// Resizing logic
	const handleMouseDown = (e) => {
		const startX = e.clientX;
		const startWidth = width;

		const handleMouseMove = (e) => {
			const newWidth = startWidth + (e.clientX - startX);
			if (newWidth > 100) {
				// Minimum width
				setWidth(newWidth);
			}
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

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
		<Card
			ref={resizableRef}
			sx={{
				width: width,
				p: 2,
				borderRadius: 0,
				boxShadow: 3,
				borderRight: 1,
				borderColor: "blue",
				position: "relative",
			}}>
			<CardContent sx={{ p: 0 }}>
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
				{/* Added styles for vertical scrolling */}
				{/* <List
					sx={{
						mt: 2,
						maxHeight: "300px", // Set the max height for the list
						overflowY: "auto", // Enable vertical scrolling
					}}>
					{friends.map((friend) => (
						<ListItem
							key={friend._id}
							sx={{
								cursor: "pointer",
								borderRadius: 2,
								p: 0,
							}}
							onClick={(e) => handleUserClick(friend.username, e)}>
							<UserItem messages={messages} user={friend} />
						</ListItem>
					))}
				</List> */}
			</CardContent>
			{/* Right border for resizing */}
			<div
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					width: 10,
					height: "100%",
					cursor: "ew-resize", // Horizontal resizing cursor
				}}
				onMouseDown={handleMouseDown}
			/>
		</Card>
	);
}

export default ChatSide;
