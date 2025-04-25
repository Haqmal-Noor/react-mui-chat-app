export const playSoundWithWebAudio = async (url) => {
	try {
		// Ensure AudioContext is resumed after user interaction
		const AudioContext = window.AudioContext || window.webkitAudioContext;
		if (!window._appAudioContext) {
			window._appAudioContext = new AudioContext();
		}

		// Resume AudioContext if it’s in a suspended state
		if (window._appAudioContext.state === "suspended") {
			await window._appAudioContext.resume();
		}

		const response = await fetch(url);
		if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

		const arrayBuffer = await response.arrayBuffer();
		const audioBuffer =
			await window._appAudioContext.decodeAudioData(arrayBuffer);
		const source = window._appAudioContext.createBufferSource();
		source.buffer = audioBuffer;
		source.connect(window._appAudioContext.destination);
		source.start(0);
	} catch (error) {
		console.error("Failed to play sound:", error);
	}
};
