import { useState } from "react";
import { Modal, IconButton, Box, useMediaQuery, useTheme } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ImageModal = ({ open, onClose, image }) => {
	const [zoom, setZoom] = useState(1);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handleZoomIn = () => setZoom((z) => Math.min(z + 0.2, 3));
	const handleZoomOut = () => setZoom((z) => Math.max(z - 0.2, 0.5));

	return (
		<Modal open={open} onClose={onClose}>
			<Box
				sx={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100vw",
					height: "100vh",
					bgcolor: "rgba(0, 0, 0, 0.95)",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					overflow: "hidden",
				}}>
				<img
					src={image}
					alt="Preview"
					style={{
						maxWidth: "100%",
						maxHeight: "100%",
						transform: `scale(${zoom})`,
						transition: "transform 0.3s ease",
					}}
				/>

				{/* Close Button */}
				<IconButton
					onClick={onClose}
					sx={{
						position: "absolute",
						top: 16,
						right: 16,
						color: "#fff",
						backgroundColor: "rgba(0,0,0,0.5)",
						"&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
					}}>
					<CloseIcon />
				</IconButton>

				{/* Zoom In */}
				<IconButton
					onClick={handleZoomIn}
					color="primary"
					sx={{
						position: "absolute",
						bottom: isMobile ? 80 : 100,
						right: 20,
						backgroundColor: "#fff",
						"&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
					}}>
					<AddIcon />
				</IconButton>

				{/* Zoom Out */}
				<IconButton
					onClick={handleZoomOut}
					color="primary"
					sx={{
						position: "absolute",
						bottom: isMobile ? 20 : 40,
						right: 20,
						backgroundColor: "#fff",
						"&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
					}}>
					<RemoveIcon />
				</IconButton>
			</Box>
		</Modal>
	);
};

export default ImageModal;
