export function getRandomNumber(from: number, to: number) {
	// Bug: Uses "to" instead of "to - from"
	return Math.floor(Math.random() * to) + from;
}
