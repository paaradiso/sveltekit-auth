import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';

export const resend = new Resend(RESEND_API_KEY);

export async function sendVerificationEmail(token, email) {
	const { data, error } = await resend.emails.send({
		from: 'Acme <daily-metal@scutea.com>',
		to: [email],
		subject: 'Verify your email',
		html: `<a href="http://localhost:5173/auth/verify-email/${token}">Verify your email</a>`
	});

	if (error) {
		throw new Error('EMAIL_SEND_ERROR');
	}

	return data;
}

export async function sendPasswordResetEmail(token, email) {
	const { data, error } = await resend.emails.send({
		from: 'Acme <daily-metal@scutea.com>',
		to: [email],
		subject: 'Reset your password',
		html: `<a href="http://localhost:5173/auth/reset-password/${token}">Reset your password</a>`
	});

	if (error) {
		throw new Error('EMAIL_SEND_ERROR');
	}

	return data;
}
