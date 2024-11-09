import { z } from 'zod';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 1024;

export const formSchema = z
	.object({
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
