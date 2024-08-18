import { getUserByEmail, createPasswordResetToken } from '$lib/auth';
import { sendPasswordResetEmail } from '$lib/email';

export const actions = {
	default: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = formData.get('email');

		const user = await getUserByEmail(email);
		if (!user) {
			return; // user does not exist
		}

		const passwordResetToken = await createPasswordResetToken(user.id);
		await sendPasswordResetEmail(passwordResetToken, user.email);
	}
};
