import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loader = ({ size }) => {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				height: "100vh", // Full height of the viewport
			}}>
			<CircularProgress size={size} color="secondary" thickness={5} />
		</Box>
	);
};

export default Loader;
