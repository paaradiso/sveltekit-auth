import { getUserBySessionId, createEmailVerificationToken } from '$lib/auth.js';
import { sendVerificationEmail } from '$lib/email.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies, locals }) {
	const { user } = locals;

	if (!user) {
		redirect(302, '/');
	}
	if (user && user.emailVerified) {
		redirect(302, '/');
	}
	return {
		email: user.email
	};
}

export const actions = {
	resendEmail: async ({ request, cookies, locals }) => {
		const { user } = locals;
		// user must exist; they would get redirected before this action is called
		const emailVerificationToken = await createEmailVerificationToken(user.id);
		await sendVerificationEmail(emailVerificationToken, user.email);
	}
};
