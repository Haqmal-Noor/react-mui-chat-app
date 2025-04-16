import React, { useEffect, useState, useRef } from "react";
import {
	TextField,
	CircularProgress,
	List,
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Box,
	Typography,
	Paper,
	Button,
} from "@mui/material";
import { debounce } from "lodash";
import axios from "axios";

const SearchBar = () => {
	const [results, setResults] = useState([]);
	const [query, setQuery] = useState("");
	const [loading, setLoading] = useState(false);
	const [showResults, setShowResults] = useState(false);
	const searchRef = useRef(null);

	return (
		<Box
			sx={{ width: "100%", maxWidth: 400, mx: "auto", mt: 3 }}
			ref={searchRef}>
			<TextField
				fullWidth
				variant="outlined"
				label="Search..."
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				onFocus={() => setShowResults(true)}
			/>

			{loading && (
				<CircularProgress sx={{ display: "block", mx: "auto", mt: 2 }} />
			)}

			{showResults && results.length > 0 && (
				<Paper
					sx={{
						mt: 2,
						bgcolor: "background.paper",
						borderRadius: 2,
						boxShadow: 2,
					}}>
					<List>
						{results.map((item, index) => (
							<ListItem key={index} button>
								<ListItemAvatar>
									<Avatar
										src={
											item.avatar ||
											"https://mui.com/static/images/avatar/1.jpg"
										}
									/>
								</ListItemAvatar>
								<ListItemText primary={item.username} secondary={item.email} />
								<Button
									variant="contained"
									color="primary"
									onClick={() => handleAddFriend(item._id)}>
									Chat
								</Button>
							</ListItem>
						))}
					</List>
				</Paper>
			)}

			{showResults && results.length === 0 && query.length > 1 && !loading && (
				<Typography color="text.secondary" mt={2} align="center">
					No results found.
				</Typography>
			)}
		</Box>
	);
};

export default SearchBar;
