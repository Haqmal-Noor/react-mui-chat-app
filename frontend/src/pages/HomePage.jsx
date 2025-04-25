import {
	Box,
	Button,
	Container,
	Typography,
	Stack,
	AppBar,
	Toolbar,
	useTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // ⬅️ Import Link
import { useAuthStore } from "../store/useAuthStore";

const HomePage = () => {
	const { authUser } = useAuthStore();
	const theme = useTheme();

	return (
		<>
			{/* App Bar */}
			<AppBar position="static" color="transparent" elevation={0}>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Stack direction="row" spacing={1} alignItems="center">
						<ChatIcon color="primary" />
						<Typography variant="h6" fontWeight="bold">
							Chatter
						</Typography>
					</Stack>
					{!authUser ? (
						<Stack direction="row" spacing={2}>
							<Button
								component={Link}
								to="/login"
								variant="text"
								color="primary">
								Login
							</Button>
							<Button
								component={Link}
								to="/register"
								variant="contained"
								color="primary">
								Sign Up
							</Button>
						</Stack>
					) : (
						<Stack direction="row" spacing={2}>
							<Button
								component={Link}
								to="/settings"
								variant="text"
								color="primary">
								Settings
							</Button>
							<Button
								component={Link}
								to="/chats"
								variant="contained"
								color="primary">
								Open Chats
							</Button>
						</Stack>
					)}
				</Toolbar>
			</AppBar>

			{/* Hero Section */}
			<Container maxWidth="md">
				<Box
					component={motion.div}
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					sx={{
						textAlign: "center",
						py: { xs: 8, md: 12 },
					}}>
					{authUser ? (
						<Typography variant="h2" fontWeight="bold" gutterBottom>
							Welcome back,{" "}
							<Typography variant="h2" color="primary">
								{authUser.username}
							</Typography>
						</Typography>
					) : (
						<Typography variant="h2" fontWeight="bold" gutterBottom>
							Welcome to Chatter
						</Typography>
					)}
					<Typography variant="h6" color="text.secondary" paragraph>
						Connect with your friends and loved ones instantly. Secure, fast,
						and easy-to-use chat platform.
					</Typography>
					<Stack direction="row" spacing={2} justifyContent="center" mt={4}>
						<Button
							component={Link}
							to="/get-started"
							size="large"
							variant="contained"
							color="primary">
							Get Started
						</Button>
						<Button
							component={Link}
							to="/about"
							size="large"
							variant="outlined"
							color="primary">
							Learn More
						</Button>
					</Stack>
				</Box>
			</Container>

			{/* Footer */}
			<Box
				sx={{ textAlign: "center", py: 4, bgcolor: theme.palette.grey[100] }}>
				<Typography variant="body2" color="text.secondary">
					&copy; {new Date().getFullYear()} Chatter Inc. All rights reserved.
				</Typography>
			</Box>
		</>
	);
};

export default HomePage;
