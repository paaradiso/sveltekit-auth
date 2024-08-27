import {
	validateEmailVerificationToken,
	getUserById,
	invalidateAllUserSessions,
	createSession,
	setSession,
	getUserBySessionId
} from '$lib/auth';
import { db } from '$lib/db/db';
import { userTable } from '$lib/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from '@sveltejs/kit';

export async function load({ params: { token }, cookies, locals }) {
	if (token.length != 64) {
		return new Response('Invalid token', { status: 400 });
	}
	const { user } = locals;
	// if (!user) {
	// 	throw redirect(302, '/');
	// }

	// if (user?.emailVerified) {
	// 	throw redirect(302, '/');
	// }

	const userId = await validateEmailVerificationToken(token);
	// if (!userId && userId !== user.id) {
	// 	throw redirect(302, '/');
	// }
	await invalidateAllUserSessions(userId);
	await db.update(userTable).set({ emailVerified: true }).where(eq(userTable.id, userId));

	const session = await createSession(userId);

	setSession(cookies.set, session);

	return {
		user
	};
}
