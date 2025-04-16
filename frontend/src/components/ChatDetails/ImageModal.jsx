import { Modal, Box } from "@mui/material";

const ImageModal = ({ open, onClose, image }) => (
	<Modal open={open} onClose={onClose}>
		<Box
			sx={{
				position: "absolute",
				top: "50%",
				left: "50%",
				transform: "translate(-50%, -50%)",
				bgcolor: "background.paper",
				boxShadow: 24,
				p: 2,
				borderRadius: 2,
			}}>
			<img
				src={image}
				alt="Enlarged preview"
				style={{ width: "100%", height: "auto", maxWidth: 500 }}
			/>
		</Box>
	</Modal>
);

export default ImageModal;
