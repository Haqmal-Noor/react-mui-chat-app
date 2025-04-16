import { Menu, MenuItem, ListItemIcon } from "@mui/material";
import {
	Reply,
	Star,
	PushPin,
	Delete,
	CheckBox,
	Info,
} from "@mui/icons-material";

const actions = [
	{ label: "Reply", icon: <Reply /> },
	{ label: "Star", icon: <Star /> },
	{ label: "Pin", icon: <PushPin /> },
	{ label: "Delete", icon: <Delete /> },
	{ label: "Select", icon: <CheckBox /> },
	{ label: "Info", icon: <Info /> },
];

const MessageMenu = ({ anchorEl, onClose }) => {
	const open = Boolean(anchorEl);

	return (
		<Menu
			anchorEl={anchorEl}
			open={open}
			onClose={onClose}
			anchorOrigin={{ vertical: "top", horizontal: "right" }}
			transformOrigin={{ vertical: "top", horizontal: "right" }}
			PaperProps={{ sx: { width: 200 } }}>
			{actions.map(({ label, icon }) => (
				<MenuItem
					key={label}
					onClick={() => {
						console.log(label);
						onClose();
					}}>
					<ListItemIcon>{icon}</ListItemIcon>
					{label}
				</MenuItem>
			))}
		</Menu>
	);
};

export default MessageMenu;
