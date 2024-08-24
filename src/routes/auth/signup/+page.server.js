import {
	createUser,
	createSession,
	setSession,
	createEmailVerificationToken,
	validateCaptcha
} from '$lib/auth';
import { sendVerificationEmail } from '$lib/email';
import { randomString } from '$lib/helpers';
import { fail, redirect } from '@sveltejs/kit';

import { superValidate, setError } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';
import { CF_TURNSTILE_SECRET_KEY } from '$env/static/private';

export async function load() {
	return {
		form: await superValidate(zod(formSchema))
	};
}

export const actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(formSchema));
		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		const token = form.data['cf-turnstile-response'];
		const { success, error } = await validateCaptcha(token, CF_TURNSTILE_SECRET_KEY);

		if (!success) {
			return setError(form, 'other', error || 'Invalid CAPTCHA');
		}

		try {
			const idLength = 8;
			const id = randomString(idLength);

			const user = await createUser({ id, ...form.data });
			const session = await createSession(user.id);
			setSession(event.cookies.set, session);

			const emailVerificationToken = await createEmailVerificationToken(user.id);
			await sendVerificationEmail(emailVerificationToken, user.email);
		} catch (error) {
			if (error.message === 'DUPLICATE_USERNAME' || error.message === 'DUPLICATE_EMAIL') {
				return setError(form, 'username', 'Username or email already exists');
			} else {
				console.error(error.message);
				return setError(
					form,
					'other',
					'An unknown error occurred. Please try again or contact support if the issue persists.'
				);
			}
		}
		redirect(302, '/auth/verify-email');
	}
};
