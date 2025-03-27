import { useEffect, useState } from "react";
import { Card, CardContent } from "@mui/material";

import UserItem from "./UserItem";
import SkeletonUsers from "./SkeletonUsers";
import UsersList from "./UsersList";
import SidebarHeader from "./SidebarHeader";

import { useRef } from "react";
import { useChatStore } from "../store/useChatStore";

function ChatSide() {
	const { getUsers, users, isUsersLoading } = useChatStore();
	const onlineUsers = [];

	useEffect(() => {
		getUsers();
	}, [getUsers]);

	const [width, setWidth] = useState(420); // Initial width of the card
	const resizableRef = useRef(null); // Ref to the resizable area

	// Resizing logic
	const handleMouseDown = (e) => {
		const startX = e.clientX;
		const startWidth = width;

		const handleMouseMove = (e) => {
			const newWidth = startWidth + (e.clientX - startX);
			if (newWidth > 100) {
				// Minimum width
				setWidth(newWidth);
			}
		};

		const handleMouseUp = () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	return (
		<Card
			ref={resizableRef}
			sx={{
				width: width,
				p: 2,
				borderRadius: 0,
				boxShadow: 3,
				borderRight: 1,
				position: "relative",
			}}>
			<CardContent sx={{ p: 0 }}>
				<SidebarHeader />
				{isUsersLoading ? (
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							gap: "15px",
							marginTop: "12px",
						}}>
						{[...Array(10)].map((_, index) => (
							<SkeletonUsers key={index} />
						))}
					</div>
				) : (
					<UsersList users={users} />
				)}
			</CardContent>
			{/* Right border for resizing */}
			<div
				style={{
					position: "absolute",
					top: 0,
					right: 0,
					width: 10,
					height: "100%",
					cursor: "ew-resize", // Horizontal resizing cursor
				}}
				onMouseDown={handleMouseDown}
			/>
		</Card>
	);
}

export default ChatSide;
