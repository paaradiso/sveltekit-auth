import { randomBytes, randomInt } from 'crypto';

export function generateSessionId() {
	const SESSION_ID_LENGTH = 128 as const;
	return randomBytes(SESSION_ID_LENGTH / 2).toString('hex');
}

export function randomFixedLengthNumber(length: number) {
	const min = 10 ** (length - 1); // inclusive
	const max = 10 ** length; // exclusive
	return randomInt(min, max);
}
