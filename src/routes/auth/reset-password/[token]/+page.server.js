import { db } from '$lib/db/db';
import { passwordResetTokenTable, userTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import {
	hashString,
	verifyString,
	createSession,
	setSession,
	validatePasswordResetToken,
	invalidateAllUserSessions,
	getUserById
} from '$lib/auth';
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

export async function load({ params: { token } }) {
	const userId = await validatePasswordResetToken(token);

	if (!userId) {
		return new Response('Invalid token', { status: 400 });
	}

	const user = await getUserById(userId);

	return {
		user,
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
		const cfToken = form.data['cf-turnstile-response'];
		const { success, error } = await validateCaptcha(cfToken, CF_TURNSTILE_SECRET_KEY);

		const errorMessage =
			error === 'missing-input-response' ? 'Please complete the CAPTCHA' : 'Invalid CAPTCHA';
		if (!success) {
			return setError(form, 'other', errorMessage);
		}

		try {
			const token = event.params.token;
			const userId = await validatePasswordResetToken(token);
			const user = await getUserById(userId);

			await invalidateAllUserSessions(user.id);

			const password = form.data.password;
			const hashedPassword = await hashString(password);

			await db
				.update(userTable)
				.set({ password: hashedPassword, emailVerified: true })
				.where(eq(userTable.id, user.id));

			const session = await createSession(user.id);
			setSession(event.cookies.set, session);
		} catch (error) {
			console.error(error.message);
			return setError(
				form,
				'other',
				'An unknown error occurred. Please try again or contact support if the issue persists.'
			);
		}
		redirect(302, `/auth/reset-password/done`);
	}
};
