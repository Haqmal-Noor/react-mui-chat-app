import { motion } from "framer-motion";
import { useTheme } from "@mui/material/styles";
import { Typography, Box } from "@mui/material";

const TypingDots = () => {
	const theme = useTheme();

	const dotVariants = {
		initial: { scale: 0.3, opacity: 0.3 },
		animate: {
			scale: [0.3, 1, 0.3],
			opacity: [0.3, 1, 0.3],
			transition: {
				duration: 1,
				repeat: Infinity,
				ease: "easeInOut",
				staggerChildren: 0.2,
			},
		},
	};

	const dotStyle = {
		width: 3,
		height: 3,
		margin: "0 2px",
		backgroundColor: `${theme.palette.primary.main}`,
		borderRadius: "50%",
		display: "inline-block",
	};

	return (
		<Box
			component="span"
			sx={{
				display: "inline-flex",
				alignItems: "center",
			}}>
			<motion.span
				style={{ display: "inline-flex", alignItems: "center" }}
				initial="initial"
				animate="animate">
				{[0, 1, 2].map((_, i) => (
					<motion.span key={i} variants={dotVariants} style={dotStyle} />
				))}
			</motion.span>
			<Typography
				variant="body2"
				component="span"
				sx={{ mr: 1, color: theme.palette.info.main }}>
				 typing
			</Typography>
		</Box>
	);
};

export default TypingDots;
