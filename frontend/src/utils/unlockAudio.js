let audioUnlocked = false;

export const unlockAudio = () => {
	if (audioUnlocked) return;

	const audio = new Audio();
	audio.src = "/sounds/notification.mp3"; // Or any short sound
	audio.load();
	audio.play().catch(() => {}); // Ignore error

	audioUnlocked = true;
};
