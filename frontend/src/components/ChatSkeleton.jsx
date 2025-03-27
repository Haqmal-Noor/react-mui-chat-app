import { Box, Skeleton, Stack } from "@mui/material";

const ChatSkeleton = () => {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: 2,
				padding: 2,
				width: "100%",
				height: "100%",
			}}>
			{/* Received Message */}
			<Stack direction="row" justifyContent="space-between">
				<Stack
					width="100%"
					direction="row"
					mb={4}
					spacing={1}
					alignItems="center">
					<Skeleton variant="circular" width={40} height={40} />
					<Stack direction="column" width="20%" spacing={1} alignItems="start">
						<Skeleton variant="rectangular" width="100%" height={10} />
						<Skeleton variant="rectangular" width="50%" height={10} />
					</Stack>
				</Stack>
				<Stack direction="row" spacing={1}>
					<Skeleton variant="circular" width={30} height={30} />
					<Skeleton variant="circular" width={30} height={30} />
					<Skeleton variant="circular" width={30} height={30} />
				</Stack>
			</Stack>
			{[...Array(6)].map((_, index) => (
				<div key={index}>
					<Stack direction="row" spacing={1} alignItems="center">
						<Skeleton variant="circular" width={40} height={40} />
						<Skeleton variant="rectangular" width="40%" height={30} />
					</Stack>

					{/* Sent Message */}
					<Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
						<Skeleton variant="rectangular" width="40%" height={30} />
						<Skeleton variant="circular" width={40} height={40} />
					</Stack>
				</div>
			))}
		</Box>
	);
};

export default ChatSkeleton;
