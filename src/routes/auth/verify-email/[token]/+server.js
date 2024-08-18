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

export async function GET({ params: { token }, cookies, locals }) {
	if (token.length != 64) {
		return new Response('Invalid token', { status: 400 });
	}
	const { user } = locals;
	if (!user) {
		return new Response('Unauthorised', { status: 400 });
	}

	const userId = await validateEmailVerificationToken(token);
	if (!userId && userId !== user.id) {
		return new Response('Invalid token', { status: 400 });
	}
	await invalidateAllUserSessions(user.id);
	await db.update(userTable).set({ emailVerified: true }).where(eq(userTable.id, user.id));

	const session = await createSession(user.id);

	setSession(cookies.set, session);

	return new Response(null, {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
