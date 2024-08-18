import { setSession, invalidateSession } from '$lib/auth';

export async function POST({ cookies, locals }) {
	const { session } = locals;
	if (!session) {
		return new Resposne('Redirect', {
			status: 302,
			headers: {
				Location: '/login'
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
