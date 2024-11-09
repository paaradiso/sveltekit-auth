import { getUserBySessionId, createPasswordResetToken } from '$lib/auth.js';
import { sendPasswordResetEmail } from '$lib/email.js';
import { redirect } from '@sveltejs/kit';

export async function load({ url }) {
	const email = url.searchParams.get('email');
	if (!email) {
		redirect(302, '/');
	}
	return {
		email
	};
}

export const actions = {
	resendEmail: async ({ request, cookies, locals }) => {
		const { user } = locals;
		// user must exist; they would get redirected before this action is called
		try {
			const emailVerificationToken = await createPasswordResetToken(user.id);
			await sendPasswordResetEmail(emailVerificationToken, user.email);
		} catch (error) {
			console.error(error);
			if (error.message === 'RATE_LIMIT') {
				return {
					error:
						'Please wait 5 minutes before requesting another password reset. This helps prevent spam and keeps your account secure.'
				};
			}
			return {
				error:
					'An unknown error occurred. Please try again or contact support if the issue persists.'
			};
		}
	}
};
