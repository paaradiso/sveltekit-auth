import { getUserByEmail, createPasswordResetToken } from '$lib/auth';
import { sendPasswordResetEmail } from '$lib/email';
import { validateCaptcha } from '$lib/auth';
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

		const email = form.data.email;

		const token = form.data['cf-turnstile-response'];
		const { success, error } = await validateCaptcha(token, CF_TURNSTILE_SECRET_KEY);

		const errorMessage =
			error === 'missing-input-response' ? 'Please complete the CAPTCHA' : 'Invalid CAPTCHA';
		if (!success) {
			return setError(form, 'other', errorMessage);
		}

		try {
			const user = await getUserByEmail(email);
			if (!user) {
				return; // user does not exist
			}

			console.log(email, user);

			const passwordResetToken = await createPasswordResetToken(user.id);
			await sendPasswordResetEmail(passwordResetToken, user.email);
		} catch (error) {
			console.error(error.message);
			return setError(
				form,
				'other',
				'An unknown error occurred. Please try again or contact support if the issue persists.'
			);
		}
		redirect(302, `/auth/reset-password/sent?email=${encodeURIComponent(email)}`);
	}
};
