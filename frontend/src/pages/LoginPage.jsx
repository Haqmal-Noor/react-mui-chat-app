import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import {
	Container,
	TextField,
	Button,
	Typography,
	Box,
	Card,
	CardContent,
	InputAdornment,
	Link,
	IconButton,
	CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);
	const { login, isLoggingIn } = useAuthStore();

	const validateForm = () => {
		if (!formData.email.trim()) return toast.error("Email is required!");
		if (!/\S+@\S+\.\S+/.test(formData.email))
			return toast.error("Invalid email format!");
		if (!formData.password) return toast.error("Password is required!");
		return true;
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const success = validateForm();
		if (success === true) login(formData);
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = (event) => event.preventDefault();

	return (
		<Box
			sx={{
				minHeight: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				padding: 2,
			}}>
			<Container maxWidth="sm">
				<Card sx={{ borderRadius: "6px", boxShadow: 3 }}>
					<CardContent>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								width: "100%",
							}}>
							<Typography variant="h4" fontWeight="bold" mb={2}>
								Login
							</Typography>
							<Box
								component="form"
								onSubmit={handleSubmit}
								sx={{
									width: "100%",
									display: "flex",
									flexDirection: "column",
									gap: 2,
								}}>
								<TextField
									fullWidth
									label="Your Email"
									type="email"
									variant="outlined"
									name="email"
									value={formData.email}
									onChange={handleChange}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Email />
											</InputAdornment>
										),
									}}
								/>
								<TextField
									fullWidth
									label="Password"
									type={showPassword ? "text" : "password"}
									variant="outlined"
									name="password"
									value={formData.password}
									onChange={handleChange}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<Lock />
											</InputAdornment>
										),
										endAdornment: (
											<InputAdornment position="end">
												<IconButton
													onClick={handleClickShowPassword}
													onMouseDown={handleMouseDownPassword}
													edge="end">
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									}}
								/>
								<Box
									sx={{
										display: "flex",
										alignItems: "center",
										justifyContent: "space-between",
										mt: 1,
									}}>
									<Typography variant="body2">
										Don't have an account?{" "}
									</Typography>
									<Link sx={{ textDecoration: "none" }} href="/register">
										<Typography variant="body2" color="primary">
											Create account
										</Typography>
									</Link>
								</Box>
								<Button
									disabled={isLoggingIn}
									type="submit"
									variant="contained"
									sx={{
										mt: 3,
									}}
									size="large"
									fullWidth>
									{isLoggingIn ? (
										<CircularProgress color="inherit" size={20} />
									) : (
										"Login"
									)}
								</Button>
							</Box>
						</Box>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
};

export default LoginPage;
