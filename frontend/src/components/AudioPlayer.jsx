import { Box } from "@mui/material";

const AudioPlayer = ({ src }) => {
	return (
		<Box
			sx={{
				width: 320,
				borderRadius: 3,
				backdropFilter: "blur(10px)", // Blur effect
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				border: "1px solid rgba(255, 255, 255, 0.2)",
			}}>
			<audio
				controls
				style={{
					width: "100%",
					outline: "none",
					borderRadius: 8,
				}}>
				<source src={src} type="audio/mpeg" />
				Your browser does not support the audio element.
			</audio>
		</Box>
	);
};

export default AudioPlayer;
