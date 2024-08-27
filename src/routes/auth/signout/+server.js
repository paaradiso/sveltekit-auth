import { setSession, invalidateSession } from '$lib/auth';

export async function POST({ cookies, locals }) {
	const { session } = locals;
	if (!session) {
		return new Response('Redirect', {
			status: 302,
			headers: {
				Location: '/'
			}
		});
	}
	await invalidateSession(session.id);
	setSession(cookies.set, null);
	return new Response('Redirect', {
		status: 302,
		headers: {
			Location: '/'
		}
	});
}
