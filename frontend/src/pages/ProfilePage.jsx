import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

import Sidebar from "../components/Sidebar";

import {
	Container,
	Card,
	Avatar,
	Typography,
	Tabs,
	Tab,
	Box,
	IconButton,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

export default function ProfilePage() {
	const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
	const [selectedImage, setSelectedImage] = useState(null);

	const [tabIndex, setTabIndex] = useState(0);

	const handleTabChange = (event, newIndex) => {
		setTabIndex(newIndex);
	};

	const handleImageChange = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.readAsDataURL(file);

			reader.onload = async () => {
				const base64Image = reader.result;
				setSelectedImage(base64Image);
				console.log("asdf");
				await updateProfile({ profilePic: base64Image });
			};
		}
	};

	return (
		<Container maxWidth="sm" sx={{ mt: 5 }}>
			<Card sx={{ p: 4, textAlign: "center" }}>
				<Box position="relative" display="inline-block">
					<Avatar
						sx={{ width: 80, height: 80, margin: "auto", cursor: "pointer" }}
						src={selectedImage || authUser.profilePic}
					/>
					<input
						accept="image/*"
						type="file"
						style={{ display: "none" }}
						id="avatar-upload"
						onChange={handleImageChange}
						disabled={isUpdatingProfile}
					/>
					<label htmlFor="avatar-upload">
						<IconButton
							component="span"
							sx={{
								position: "absolute",
								bottom: 0,
								right: 0,
								bgcolor: "white",
							}}>
							<PhotoCamera />
						</IconButton>
					</label>
				</Box>
				<Typography color="text.secondary">
					{isUpdatingProfile
						? "Uploading..."
						: "Click to update your profile picture"}
				</Typography>
				<Typography variant="h5" sx={{ mt: 2 }}>
					{authUser.username}
				</Typography>
				<Typography>bio</Typography>
			</Card>

			<Tabs value={tabIndex} onChange={handleTabChange} centered sx={{ mt: 3 }}>
				<Tab label="Overview" />
				<Tab label="Settings" />
				<Tab label="Activity" />
			</Tabs>

			<Box sx={{ mt: 3 }}>
				{tabIndex === 1 && (
					<Typography>Welcome to your profile, {authUser.username}!</Typography>
				)}
				{tabIndex === 0 && (
					<Box
						component="form"
						sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<Box
							sx={{
								display: "flex",
								justifyContent: "start",
								padding: "20px",
								alignItems: "center",
								border: "1px solid",
								width: "100%",
								height: "50px",
								borderRadius: "4px",
							}}>
							{authUser.username}
						</Box>
						<Box
							sx={{
								display: "flex",
								justifyContent: "start",
								padding: "20px",
								alignItems: "center",
								border: "1px solid",
								width: "100%",
								height: "50px",
								borderRadius: "4px",
							}}>
							{authUser.email}
						</Box>
						<Typography
							sx={{
								borderBottom: "1px solid rgb(172, 170, 170)",
								pb: 1,
								mt: 3,
							}}
							variant="h5">
							Account information
						</Typography>
						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
							}}>
							<Typography>Member since</Typography>
							<Typography>{authUser.createdAt?.split("T")[0]}</Typography>
						</Box>

						<Box
							sx={{
								display: "flex",
								justifyContent: "space-between",
							}}>
							<Typography>Account status</Typography>
							<Typography sx={{ color: "green" }}>Active</Typography>
						</Box>
					</Box>
				)}
				{tabIndex === 2 && (
					<Typography>Your recent activity will appear here.</Typography>
				)}
			</Box>
		</Container>
	);
}
