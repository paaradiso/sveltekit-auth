import { z } from 'zod';

export const formSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address' }).toLowerCase(),
	'cf-turnstile-response': z.string()
});
