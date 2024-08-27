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
		try {
			const emailVerificationToken = await createEmailVerificationToken(user.id);
			console.log(emailVerificationToken);
			await sendVerificationEmail(emailVerificationToken, user.email);
		} catch (error) {
			console.error(error);
			if (error.message === 'RATE_LIMIT') {
				return {
					error:
						'Please wait 5 minutes before requesting another verification email. This helps prevent spam and keeps your account secure.'
				};
			}
			return {
				error:
					'An unknown error occurred. Please try again or contact support if the issue persists.'
			};
		}
	}
};
