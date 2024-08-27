import { z } from 'zod';

export const formSchema = z.object({
	usernameOrEmail: z.string().trim().min(1, {
		message: 'Please enter a username or email address'
	}),
	password: z.string().trim().min(1, {
		message: 'Please enter a password'
	}),
	'cf-turnstile-response': z.string()
});
