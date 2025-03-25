export const getCurrentTime = () => {
	const now = new Date();
	let hours = now.getHours();
	const minutes = now.getMinutes();

	const ampm = hours >= 12 ? "PM" : "AM";

	hours = hours % 12 || 12;

	return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};
