import { useEffect, useState } from "react";
import { Card, CardContent, useMediaQuery } from "@mui/material";

import SkeletonUsers from "../Loaders/SkeletonUsers";
import ChatsList from "./ChatsList";
import SidebarHeader from "./SidebarHeader";

import { useRef } from "react";
import { useChatStore } from "../../store/useChatStore";

function ChatSide() {
	const { getChats, chats, isChatsLoading } = useChatStore();


	useEffect(() => {
		getChats();
	}, [getChats]);

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

	const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm")); // Set your breakpoint

	return (
		<Card
			ref={resizableRef}
			sx={{
				width: isSmallScreen ? 500 : width,
				p: 2,
				borderRadius: 0,
				boxShadow: 3,
				borderRight: 0.5,
				position: "relative",
			}}>
			<CardContent sx={{ p: 0 }}>
				<SidebarHeader />
				{isChatsLoading ? (
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
				) : chats.length !== 0 ? (
					<ChatsList chats={chats} />
				) : (
					<h4>No Chats Yet</h4>
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
