import { db } from '$lib/db/db';
import { passwordResetTokenTable, userTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';
import {
	hashPassword,
	createSession,
	setSession,
	validatePasswordResetToken,
	invalidateAllUserSessions,
	getUserById
} from '$lib/auth';

export async function load({ params: { token } }) {
	const [tokenIsInDatabase] = await db
		.select()
		.from(passwordResetTokenTable)
		.where(eq(passwordResetTokenTable.id, token));
	if (!tokenIsInDatabase) {
		// token is not in database
		redirect(302, '/auth/signin');
	}
	return;
}

export const actions = {
	default: async ({ request, params: { token }, cookies }) => {
		const formData = await request.formData();
		const password = formData.get('password');

		const userId = await validatePasswordResetToken(token);
		const user = await getUserById(userId);

		await invalidateAllUserSessions(user.id);

		const hashedPassword = await hashPassword(password);

		console.log({ userId, user, hashedPassword, password });

		await db
			.update(userTable)
			.set({ password: hashedPassword, emailVerified: true })
			.where(eq(userTable.id, user.id));

		const session = await createSession(user.id);

		setSession(cookies.set, session);

		redirect(302, '/');
	}
};
