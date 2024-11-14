import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
// import { randomInt, randomBytes } from 'crypto';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateSessionId() {
	const SESSION_ID_LENGTH = 128 as const;

	return randomBytes(SESSION_ID_LENGTH / 2).toString('hex');
}

// export function randomFixedLengthNumber(length: number) {
// 	const min = 10 ** (length - 1); // inclusive
// 	const max = 10 ** length; // exclusive
// 	return randomInt(min, max);
// }
