import { Resend } from 'resend';
import { RESEND_API_KEY } from '$env/static/private';
import { PUBLIC_AUTH_EMAIL_NAME, PUBLIC_AUTH_EMAIL_ADDRESS } from '$env/static/public';

export const resend = new Resend(RESEND_API_KEY);

export async function sendVerificationEmail(token, email) {
	const { data, error } = await resend.emails.send({
		from: `${PUBLIC_AUTH_EMAIL_NAME} <${PUBLIC_AUTH_EMAIL_ADDRESS}>`,
		to: [email],
		subject: 'Verify your email',
		html: `<a href="https://auth-template.scutea.com/auth/verify-email/${token}">Verify your email</a>`
	});

	if (error) {
		throw new Error('EMAIL_SEND_ERROR');
	}

	return data;
}

export async function sendPasswordResetEmail(token, email) {
	const { data, error } = await resend.emails.send({
		from: `${PUBLIC_AUTH_EMAIL_NAME} <${PUBLIC_AUTH_EMAIL_ADDRESS}>`,
		to: [email],
		subject: 'Reset your password',
		html: `<a href="https://auth-template.scutea.com/auth/reset-password/${token}">Reset your password</a>`
	});

	if (error) {
		throw new Error('EMAIL_SEND_ERROR');
	}

	return data;
}
