import { useState, useRef, useEffect } from "react";
import { IconButton, CircularProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

import { useChatStore } from "../store/useChatStore";

const VoiceRecorder = () => {
	const { sendMessage } = useChatStore();

	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef(null);
	const audioChunks = useRef([]);
	const streamRef = useRef(null);

	const toggleRecording = async () => {
		if (!isRecording) {
			try {
				const stream = await navigator.mediaDevices.getUserMedia({
					audio: true,
				});
				streamRef.current = stream;

				mediaRecorderRef.current = new MediaRecorder(stream);
				audioChunks.current = [];

				mediaRecorderRef.current.ondataavailable = (event) => {
					if (event.data.size > 0) {
						audioChunks.current.push(event.data);
					}
				};

				mediaRecorderRef.current.onstop = async () => {
					const audioBlob = new Blob(audioChunks.current, {
						type: "audio/webm",
					});
					const reader = new FileReader();

					reader.onloadend = async () => {
						const base64Audio = reader.result.split(",")[1]; // Extract base64 string only
						await sendMessage({ audio: base64Audio }); // Send base64 audio
					};

					reader.readAsDataURL(audioBlob);
					streamRef.current.getTracks().forEach((track) => track.stop());
				};

				mediaRecorderRef.current.start();
				setIsRecording(true);
			} catch (error) {
				console.error("Microphone access denied:", error);
			}
		} else {
			mediaRecorderRef.current?.stop();
			setIsRecording(false);
		}
	};

	useEffect(() => {
		return () => {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	return (
		<IconButton
			color={isRecording ? "error" : "primary"}
			onClick={toggleRecording}
			size="large">
			{isRecording ? (
				<StopIcon fontSize="large" />
			) : (
				<MicIcon fontSize="large" />
			)}
			{isRecording && (
				<CircularProgress size={24} sx={{ position: "absolute" }} />
			)}
		</IconButton>
	);
};

export default VoiceRecorder;
