import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	IconButton,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from "@mui/material";
import { Logout } from "@mui/icons-material";

function LogoutButton({ onLogout }) {
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);
	const handleConfirmLogout = () => {
		setOpen(false);
		onLogout();
		navigate("/login");
	};
	return (
		<div>
			<IconButton color="inherit" onClick={() => setOpen(true)}>
				<Logout />
			</IconButton>

			<Dialog open={open} onClose={() => setOpen(false)}>
				<DialogTitle>Confirm Logout</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Are you sure you want to log out?
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpen(false)} color="primary">
						Cancel
					</Button>
					<Button onClick={handleConfirmLogout} color="error">
						Logout
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}

export default LogoutButton;
