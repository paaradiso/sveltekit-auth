import { z } from 'zod';

const USERNAME_MIN_LENGTH = 4;
const USERNAME_MAX_LENGTH = 50;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 1024;

export const formSchema = z
	.object({
		username: z
			.string()
			.trim()
			.min(USERNAME_MIN_LENGTH, {
				message: `Username must be at least ${USERNAME_MIN_LENGTH} characters long`
			})
			.max(USERNAME_MAX_LENGTH, {
				message: `Username must be at most ${USERNAME_MAX_LENGTH} characters long`
			})
			.regex(/^[a-zA-Z0-9_-]+$/, {
				message: 'Username can only contain letters, numbers, underscores, and hyphens'
			}),
		email: z.string().email({ message: 'Please enter a valid email address' }).toLowerCase(),
		password: z
			.string()
			.min(PASSWORD_MIN_LENGTH, {
				message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`
			})
			.max(PASSWORD_MAX_LENGTH, {
				message: `Password must be at most ${PASSWORD_MAX_LENGTH} characters long`
			}),
		confirmPassword: z.string(),
		'cf-turnstile-response': z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});
