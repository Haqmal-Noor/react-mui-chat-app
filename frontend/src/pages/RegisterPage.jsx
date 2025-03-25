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

import {
	Visibility,
	VisibilityOff,
	AccountCircle,
	Email,
	Lock,
} from "@mui/icons-material";
import { toast } from "react-toastify";
const RegisterPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassword] = useState(false);

	const { signup, isSigningUp } = useAuthStore();

	const validateForm = () => {
		if (!formData.username.trim()) return toast.error("Username is required!");
		if (!formData.email.trim()) return toast.error("Email is required!");
		if (!/\S+@\S+\.\S+/.test(formData.email))
			return toast.error("Invalid email format!");
		if (!formData.password) return toast.error("Password is required!");
		if (formData.password.length < 6)
			return toast.error("Password must be at least 6 characters!");
		return true;
	};

	const handleSubmit = (event) => {
		event.preventDefault();

		const success = validateForm();
		if (success === true) signup(formData);
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};
	const handleClickShowPassword = () => setShowPassword(!showPassword);
	const handleMouseDownPassword = (event) => event.preventDefault;

	return (
		<Box
			sx={{
				backgroundColor: "#eee",
				height: "100vh",
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
			}}>
			<Container maxWidth="lg">
				<Card sx={{ height: "60%", padding: "40px", borderRadius: "25px" }}>
					<CardContent
						sx={{
							display: "flex",
							flexDirection: "row",
							alignItems: "center",
						}}>
						<Box
							sx={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}>
							<Typography variant="h4" fontWeight="bold" mb={3}>
								Sign Up
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
									label="Your Name"
									variant="outlined"
									name="username"
									value={formData.name}
									onChange={handleChange}
									InputProps={{
										startAdornment: (
											<InputAdornment position="start">
												<AccountCircle />
											</InputAdornment>
										),
									}}
								/>
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
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Typography>Already have an account? </Typography>
									<Link sx={{ textDecoration: "none" }} href="/login">
										Login
									</Link>
								</Box>
								<Button
									disabled={isSigningUp}
									type="submit"
									variant="contained"
									sx={{
										mt: 3,
									}}
									size="large"
									fullWidth>
									{isSigningUp ? (
										<CircularProgress color="inherit" size={20} />
									) : (
										"Create account"
									)}
								</Button>
							</Box>
						</Box>
						<Box sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
							<img
								src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
								alt="Sample"
								style={{ width: "100%" }}
							/>
						</Box>
					</CardContent>
				</Card>
			</Container>
		</Box>
	);
};

export default RegisterPage;
