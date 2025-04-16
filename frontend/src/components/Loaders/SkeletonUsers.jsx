import { Skeleton } from "@mui/material";
export default function SkeletonUsers() {
	return (
		<div style={{ display: "flex", width: "100%" }}>
			<Skeleton variant="circular" width={50} height={40} sx={{ mr: 3 }} />
			<div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
				<Skeleton width="100%" height={20} />
				<div style={{ display: "flex" }}>
					<Skeleton sx={{ mr: 2 }} width="50%" height={20} />
					<Skeleton width="50%" height={20} />
				</div>
			</div>
		</div>
	);
}
