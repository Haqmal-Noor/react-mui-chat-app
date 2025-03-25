import React from "react";
import {
	Container,
	TextField,
	Checkbox,
	Button,
	Typography,
	Box,
	Card,
	CardContent,
	FormControlLabel,
	Grid,
	Link,
} from "@mui/material";

const LoginPage = () => {
	return (
		<Container
			maxWidth="md"
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh",
			}}>
			<Card
				sx={{
					display: "flex",
					flexDirection: { xs: "column", md: "row" },
					borderRadius: "10px",
					overflow: "hidden",
				}}>
				<Box
					component="img"
					src="https://mdbootstrap.com/img/new/ecommerce/vertical/004.jpg"
					alt="Trendy Pants and Shoes"
					sx={{
						width: { xs: "100%", md: "40%" },
						objectFit: "cover",
						display: { xs: "none", md: "block" },
					}}
				/>
				<CardContent sx={{ p: 5, flex: 1 }}>
					<Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
						Sign In
					</Typography>
					<Box
						component="form"
						sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<TextField
							fullWidth
							label="Email address"
							type="email"
							variant="outlined"
						/>
						<TextField
							fullWidth
							label="Password"
							type="password"
							variant="outlined"
						/>
						<Grid container alignItems="center" justifyContent="space-between">
							<FormControlLabel
								control={<Checkbox defaultChecked />}
								label="Remember me"
							/>
							<Link href="#!" variant="body2">
								Forgot password?
							</Link>
						</Grid>
						<Button variant="contained" fullWidth size="large">
							Sign in
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Container>
	);
};

export default LoginPage;
