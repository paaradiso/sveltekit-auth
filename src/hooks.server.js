import { getSession, getUserBySessionId } from '$lib/auth';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get('session');

	event.locals.session = await getSession(sessionId);

	if (event.locals.session?.expiresAt < new Date()) {
		// if session has expired
		event.cookies.delete('session', {
			path: '/'
		});
	}

	if (!event.locals.session && sessionId) {
		// if session cookie exists but session does not
		event.cookies.delete('session', {
			path: '/'
		});
	}

	event.locals.user = event.locals.session ? await getUserBySessionId(sessionId) : null; // get user only if session exists to avoid unnecessary db queries

	delete event.locals.user?.password;

	return await resolve(event);
}
