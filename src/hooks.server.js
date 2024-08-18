import { randomNumber, randomFixedLengthNumber } from '$lib/helpers';
import { getSession, getUserBySessionId } from '$lib/auth';

export async function handle({ event, resolve }) {
	const sessionId = event.cookies.get('session');

	event.locals.session = await getSession(sessionId);
	event.locals.user = await getUserBySessionId(sessionId);

	return await resolve(event);
}
