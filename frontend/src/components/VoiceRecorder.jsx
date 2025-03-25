import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { IconButton, CircularProgress } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

const VoiceRecorder = ({ socket, sender, receiver, setMessages }) => {
	const [isRecording, setIsRecording] = useState(false);
	const mediaRecorderRef = useRef(null);
	const audioChunks = useRef([]);
	const streamRef = useRef(null);

	const sendVoiceMessage = async (base64Audio) => {
		try {
			const response = await axios.post(
				"http://localhost:5000/api/chat/send-voice-message",
				{
					sender,
					receiver,
					audio: base64Audio,
					format: "audio/webm",
				},
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				}
			);
			const data = response.data;
			console.log("Voice message saved:", data);
			

			setMessages((prev) => [
				...prev,
				{
					sender,
					receiver,
					content: data.audioUrl || base64Audio,
					type: "sent",
					format: "audio/webm",
					timestamp: new Date().toLocaleTimeString(),
				},
			]);
		} catch (error) {
			console.error("Error saving voice message:", error);
		}
	};

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
						const base64Audio = reader.result;
						socket.emit("send-voice", sender, receiver, base64Audio);
						await sendVoiceMessage(base64Audio);
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
