import Sidebar from "../components/Sidebar.jsx";
import { themes } from "../theme/theme.js";
import { Grid, Card, CardContent } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import Preview from "../components/Preview.jsx";
import { useMediaQuery } from "@mui/material";

const SettingsPage = ({ currentTheme, setCurrentTheme }) => {
	const isSmallScreen = useMediaQuery("(max-width: 768px)");

	// Handle the theme change when a user clicks on a theme card
	const handleThemeChange = (theme) => {
		setCurrentTheme(theme);
	};

	return (
		<div
			style={{
				display: "flex",
				flexDirection: isSmallScreen ? "column" : "row",
			}}>
			{!isSmallScreen && <Sidebar />} {/* Hide sidebar on small screens */}
			<div style={{ flexGrow: 1, padding: 20 }}>
				<h1>Choose your theme: </h1>
				<hr />
				<Grid
					mt={3}
					container
					spacing={2}
					direction={isSmallScreen ? "column" : "row"}>
					<Grid item xs={12} md={8}>
						<Grid container spacing={2}>
							{Object.keys(themes).map((themeKey) => (
								<Grid item xs={6} sm={3} md={3} key={themeKey}>
									<Card
										onClick={() => handleThemeChange(themeKey)}
										style={{ cursor: "pointer" }}>
										<CardContent>
											<div
												style={{
													display: "flex",
													alignItems: "center",
													gap: "6px",
												}}>
												<div
													style={{
														width: "50px",
														height: "50px",
														borderRadius: "4px",
														backgroundColor:
															themes[themeKey].palette.primary.main,
													}}></div>
												<div
													style={{
														width: "50px",
														height: "50px",
														borderRadius: "4px",
														backgroundColor:
															themes[themeKey].palette.text.primary,
													}}></div>
												<div
													style={{
														width: "50px",
														height: "50px",
														borderRadius: "4px",
														backgroundColor:
															themes[themeKey].palette.background.default,
													}}></div>
												{currentTheme === themeKey && (
													<CheckCircle
														size="large"
														sx={{ ml: 1, color: "green" }}
													/>
												)}
											</div>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</Grid>
					<Grid item xs={12} md={4}>
						<Preview />
					</Grid>
				</Grid>
			</div>
		</div>
	);
};

export default SettingsPage;
