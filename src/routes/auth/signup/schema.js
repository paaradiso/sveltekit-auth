import { z } from 'zod';
export const formSchema = z
	.object({
		username: z
			.string()
			.regex(/^[a-zA-Z0-9_-]+$/, {
				message: 'Contains invalid characters'
			})
			.min(5, { message: 'Must contain at least 5 characters' })
			.max(50, { message: 'Must contain fewer than 50 characters' }),
		email: z.string().email({ message: 'Invalid email address' }),
		password: z.string().min(8, { message: 'Must contain at least 8 characters' }).max(1024),
		confirmPassword: z.string().min(8, { message: 'Must contain at least 8 characters' }).max(1024)
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});
