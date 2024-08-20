import { isValidEmail } from '$lib/helpers';
import {
	getUserByEmail,
	getUserByUsername,
	verifyString,
	setSession,
	createSession
} from '$lib/auth';
import { redirect } from '@sveltejs/kit';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const { usernameOrEmail, password } = Object.fromEntries(formData);
		const inputType = isValidEmail(usernameOrEmail) ? 'email' : 'username';

		let user;
		if (inputType === 'email') {
			user = await getUserByEmail(usernameOrEmail);
		} else {
			user = await getUserByUsername(usernameOrEmail);
		}
		const passwordIsValid = await verifyString(password, user.password);
		if (!passwordIsValid) {
			return; // password is not valid
		}

		const session = await createSession(user.id);
		setSession(cookies.set, session);

		redirect(302, '/');
	}
};
