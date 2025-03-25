import React, { useState } from "react";
import { Menu, MenuItem, TextField, IconButton } from "@mui/material";
import { Chat } from "@mui/icons-material";

const SearchableDropdown = ({ items }) => {
	const [anchorEl, setAnchorEl] = useState(null);
	const [search, setSearch] = useState("");

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const filteredItems = items.filter((item) =>
		item.toLowerCase().includes(search.toLowerCase())
	);

	return (
		<div>
			<IconButton onClick={handleClick} color="primary">
				<Chat />
			</IconButton>
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
				<TextField
					variant="outlined"
					placeholder="Search..."
					size="small"
					fullWidth
					onChange={(e) => setSearch(e.target.value)}
					style={{ margin: "8px" }}
				/>
				{filteredItems.map((item, index) => (
					<MenuItem key={index} onClick={handleClose}>
						{item}
					</MenuItem>
				))}
			</Menu>
		</div>
	);
};

export default SearchableDropdown;
