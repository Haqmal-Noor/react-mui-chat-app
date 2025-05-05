import {
	AppBar,
	Toolbar,
	Typography,
	Button,
	Stack,
	Container,
	Box,
	useTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { motion } from "framer-motion";

const HomePage = () => {
	const { authUser } = useAuthStore();
	const theme = useTheme();

	return (
		<>
			{/* App Bar */}
			<AppBar
				position="sticky"
				elevation={0}
				sx={{
					backdropFilter: "blur(10px)",
					backgroundColor: "rgba(255,255,255,0.75)",
					borderBottom: `1px solid ${theme.palette.divider}`,
				}}>
				<Toolbar sx={{ justifyContent: "space-between" }}>
					<Stack direction="row" alignItems="center" spacing={1}>
						<ChatIcon color="primary" fontSize="large" />
						<Typography variant="h5" fontWeight={700}>
							Chatter
						</Typography>
					</Stack>
					<Stack direction="row" spacing={2}>
						{!authUser ? (
							<>
								<Button
									component={Link}
									to="/login"
									color="primary"
									variant="text"
									sx={{ fontWeight: 600 }}>
									Login
								</Button>
								<Button
									component={Link}
									to="/register"
									variant="contained"
									color="primary"
									sx={{
										fontWeight: 600,
										boxShadow: "none",
										":hover": { boxShadow: 3 },
									}}>
									Sign Up
								</Button>
							</>
						) : (
							<>
								<Button
									component={Link}
									to="/settings"
									color="primary"
									variant="text"
									sx={{ fontWeight: 600 }}>
									Settings
								</Button>
								<Button
									component={Link}
									to="/chats"
									variant="contained"
									color="primary"
									sx={{
										fontWeight: 600,
										boxShadow: "none",
										":hover": { boxShadow: 3 },
									}}>
									Open Chats
								</Button>
							</>
						)}
					</Stack>
				</Toolbar>
			</AppBar>

			{/* Hero Section */}
			<Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 } }}>
				<Box
					component={motion.div}
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					sx={{ textAlign: "center" }}>
					<Typography
						variant="h2"
						fontWeight={800}
						gutterBottom
						sx={{
							fontSize: { xs: "2.5rem", md: "4rem" },
							lineHeight: 1.2,
						}}>
						{authUser ? (
							<>
								Welcome back,&nbsp;
								<Box component="span" color="primary.main">
									{authUser.username}
								</Box>
							</>
						) : (
							<>
								Connect.&nbsp;
								<Box component="span" color="primary.main">
									Chat.
								</Box>{" "}
								Repeat.
							</>
						)}
					</Typography>

					<Typography
						variant="h6"
						color="text.secondary"
						sx={{
							maxWidth: "600px",
							mx: "auto",
							mt: 2,
							fontSize: { xs: "1rem", md: "1.25rem" },
						}}>
						Secure, fast, and delightfully simple chat platform — built for the
						moments that matter most.
					</Typography>

					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={2}
						justifyContent="center"
						mt={5}>
						<Button
							component={Link}
							to="/get-started"
							size="large"
							variant="contained"
							color="primary"
							sx={{
								fontWeight: 600,
								px: 4,
								py: 1.5,
								boxShadow: "none",
								":hover": { boxShadow: 4 },
							}}>
							Get Started
						</Button>
						<Button
							component={Link}
							to="/about"
							size="large"
							variant="outlined"
							color="primary"
							sx={{
								fontWeight: 600,
								px: 4,
								py: 1.5,
								borderWidth: 2,
								":hover": {
									borderWidth: 2,
								},
							}}>
							Learn More
						</Button>
					</Stack>
				</Box>
			</Container>
		</>
	);
};

export default HomePage;
