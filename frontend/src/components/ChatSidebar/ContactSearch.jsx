import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";

import { useChatStore } from "../../store/useChatStore";
import { useAuthStore } from "../../store/useAuthStore";

import {
	Popover,
	TextField,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Avatar,
	IconButton,
	CircularProgress
} from "@mui/material";
import Search from "@mui/icons-material/Search";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import { toast } from "react-toastify";

const DropdownMenuForContactsSearch = () => {
	const navigate = useNavigate();

	const { createNewChat, isSearchingContacts } = useChatStore();
	const { authUser } = useAuthStore();

	const [anchorEl, setAnchorEl] = useState(null);
	const [search, setSearch] = useState("");

	const [contacts, setContacts] = useState([]);

	const handleOpen = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleCreateChat = async (item) => {
		const response = await createNewChat([authUser._id, item._id]);
		console.log(response);
		navigate(`/chats/${response._id}`);
	};

	useEffect(() => {
		const getContacts = async () => {
			try {
				const response = await axiosInstance.get(`/users/search?q=${search}`);
				setContacts(response.data);
			} catch (error) {
				toast.error(error.response.data.message);
			}
		};

		getContacts();
	}, [search]);

	return (
		<>
			<IconButton color="primary" onClick={handleOpen}>
				<OpenInNewIcon />
			</IconButton>

			<Popover
				open={Boolean(anchorEl)}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{ vertical: "bottom", horizontal: "left" }}>
				<div style={{ width: 320, padding: "10px" }}>
					<h2 style={{ margin: 0, marginBottom: "10px" }}>New chat</h2>
					<TextField
						fullWidth
						size="small"
						variant="outlined"
						placeholder="Search..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						InputProps={{
							startAdornment: <Search style={{ marginRight: 8 }} />,
						}}
					/>

					{isSearchingContacts && (
						<CircularProgress sx={{ display: "block", mx: "auto", mt: 2 }} />
					)}
					<List>
						{contacts.length !== 0 ? (
							contacts.map((item, index) => (
								<ListItem
									button
									key={index}
									onClick={() => handleCreateChat(item)}>
									{/* Avatar for Profile Picture */}
									<ListItemAvatar>
										<Avatar src={item.profilePic} alt={item.username}>
											{item.username.charAt(0)}{" "}
											{/* Fallback to first letter if no image */}
										</Avatar>
									</ListItemAvatar>

									{/* Contact Username */}
									<ListItemText primary={item.username} />
								</ListItem>
							))
						) : (
							<h4 style={{ textAlign: "center" }}>No result</h4>
						)}
					</List>
				</div>
			</Popover>
		</>
	);
};

export default DropdownMenuForContactsSearch;
