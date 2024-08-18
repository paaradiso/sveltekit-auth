import { createUser, createSession, setSession, createEmailVerificationToken } from '$lib/auth';
import { sendVerificationEmail } from '$lib/email';
import { randomString } from '$lib/helpers';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const userData = Object.fromEntries(formData);

		const idLength = 8;
		const id = randomString(idLength);

		const user = await createUser({ id, ...userData });

		const session = await createSession(user.id);

		setSession(cookies.set, session);

		const emailVerificationToken = await createEmailVerificationToken(user.id);

		await sendVerificationEmail(emailVerificationToken, user.email);

		redirect(302, '/auth/verify-email');
	}
};
