import { randomBytes, randomInt, timingSafeEqual } from 'crypto';

export function randomString(length) {
	return randomBytes(length).toString('hex').substring(0, length);
}

export function randomNumber(...nums) {
	if (!nums || nums.length > 2) return;
	return randomInt(...nums);
}

export function randomFixedLengthNumber(length) {
	const min = 10 ** (length - 1); // inclusive
	const max = 10 ** length; // exclusive
	return randomInt(min, max);
}

export function isValidEmail(email) {
	if (typeof email !== 'string') return false;
	if (email.length > 255) return false;
	const emailRegexp = /^.+@.+$/;
	return emailRegexp.test(email);
}
