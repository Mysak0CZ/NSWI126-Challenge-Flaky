import { getRandomNumber } from "../src/utils";

describe('Flaky test', () => {
	it('checks something that is okay', () => {
		const value = getRandomNumber(0, 5);
		expect(value).toBeGreaterThanOrEqual(0);
		expect(value).toBeLessThan(5);
	});

	it('checks something that can fail', () => {
		const value = getRandomNumber(1, 3);
		expect(value).toBeGreaterThanOrEqual(1);
		expect(value).toBeLessThan(3);
	});
	
	// Repeats to increase chance of trigger for demonstration purposes
	it('checks something that can fail (2)', () => {
		const value = getRandomNumber(1, 3);
		expect(value).toBeGreaterThanOrEqual(1);
		expect(value).toBeLessThan(3);
	});

	it('checks something that can fail (3)', () => {
		const value = getRandomNumber(1, 3);
		expect(value).toBeGreaterThanOrEqual(1);
		expect(value).toBeLessThan(3);
	});
});
