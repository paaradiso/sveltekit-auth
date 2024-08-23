import { createUser, createSession, setSession, createEmailVerificationToken } from '$lib/auth';
import { sendVerificationEmail } from '$lib/email';
import { randomString } from '$lib/helpers';
import { fail, redirect } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { formSchema } from './schema';
import { zod } from 'sveltekit-superforms/adapters';

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

		const idLength = 8;
		const id = randomString(idLength);

		const user = await createUser({ id, ...form.data });
		const session = await createSession(user.id);
		setSession(event.cookies.set, session);

		const emailVerificationToken = await createEmailVerificationToken(user.id);
		await sendVerificationEmail(emailVerificationToken, user.email);

		redirect(302, '/auth/verify-email');
	}
};
