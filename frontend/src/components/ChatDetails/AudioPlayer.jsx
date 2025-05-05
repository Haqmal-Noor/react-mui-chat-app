import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer";
import { Box, IconButton, Typography, Card } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";

import { useTheme } from "@mui/material/styles";

const formatTime = (seconds) => {
	const mins = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
};

const AudioPlayer = ({ src }) => {
	const waveformRef = useRef(null);
	const wavesurfer = useRef(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [duration, setDuration] = useState(0);
	const [currentTime, setCurrentTime] = useState(0);

	const theme = useTheme();

	useEffect(() => {
		if (!waveformRef.current) return;

		wavesurfer.current = WaveSurfer.create({
			container: waveformRef.current,
			progressColor: theme.palette.primary.main,
			cursorColor: theme.palette.primary.main,
			barWidth: 1.5,
			barRadius: 2,
			responsive: true,
			height: 40,
		});

		wavesurfer.current.load(src);

		wavesurfer.current.on("ready", () => {
			setDuration(wavesurfer.current.getDuration());
		});

		wavesurfer.current.on("audioprocess", () => {
			setCurrentTime(wavesurfer.current.getCurrentTime());
		});

		wavesurfer.current.on("finish", () => {
			setIsPlaying(false);
			setCurrentTime(duration);
		});

		return () => {
			wavesurfer.current.destroy();
		};
	}, [src]);

	const togglePlayback = () => {
		if (wavesurfer.current) {
			wavesurfer.current.playPause();
			setIsPlaying(!isPlaying);
		}
	};

	return (
		<Card
			sx={{
				width: 325,
				p: 1,
				backgroundColor: theme.palette.background.paper,
				borderRadius: 1,
				backdropFilter: "blur(10px)",
				display: "flex",
				alignItems: "center",
				gap: 2,
			}}>
			<IconButton
				onClick={togglePlayback}
				sx={{
					color: theme.palette.primary.main,
					backgroundColor: theme.palette.background.default,
				}}>
				{isPlaying ? <Pause /> : <PlayArrow />}
			</IconButton>
			<Box
				ref={waveformRef}
				sx={{
					flex: 1,
					backgroundColor: theme.palette.background.default,
					borderRadius: 1,
					cursor: "pointer",
				}}
			/>
			<Typography
				variant="body2"
				color="text.secondary"
				sx={{ minWidth: 50, textAlign: "right" }}>
				{formatTime(currentTime)} / {formatTime(duration)}
			</Typography>
		</Card>
	);
};

export default AudioPlayer;
