import { isValidEmail } from '$lib/helpers';
import {
	getUserByEmail,
	getUserByUsername,
	verifyString,
	setSession,
	createSession,
	validateCaptcha
} from '$lib/auth';
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

		const errorMessage =
			error === 'missing-input-response' ? 'Please complete the CAPTCHA' : 'Invalid CAPTCHA';
		if (!success) {
			return setError(form, 'other', errorMessage);
		}

		try {
			const { usernameOrEmail, password } = form.data;
			const inputType = isValidEmail(usernameOrEmail) ? 'email' : 'username';
			const inputTypeCapitalised = inputType.charAt(0).toUpperCase() + inputType.slice(1);

			let user;
			if (inputType === 'email') {
				user = await getUserByEmail(usernameOrEmail);
			} else {
				user = await getUserByUsername(usernameOrEmail);
			}

			if (!user) {
				return setError(
					form,
					'usernameOrEmail',
					`${inputTypeCapitalised} or password is incorrect`
				);
			}
			const passwordIsValid = await verifyString(password, user.password);
			if (!passwordIsValid) {
				// TODO: Combine !user and !passwordIsValid checks to prevent timing attacks
				return setError(
					form,
					'usernameOrEmail',
					`${inputTypeCapitalised} or password is incorrect`
				);
			}

			const session = await createSession(user.id);
			setSession(event.cookies.set, session);
		} catch (error) {
			console.error(error);
			return setError(
				form,
				'other',
				'An unknown error occurred. Please try again or contact support if the issue persists.'
			);
		}
		redirect(302, '/');
	}
};
