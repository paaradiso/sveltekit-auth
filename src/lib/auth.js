import { db } from '$lib/db/db';
import { eq } from 'drizzle-orm';
import {
	userTable,
	sessionTable,
	emailVerificationTokenTable,
	passwordResetTokenTable
} from '$lib/db/schema';
import { randomString, isValidEmail } from '$lib/helpers';
import argon2 from 'argon2';

export async function hashString(string) {
	return await argon2.hash(string);
}

export async function verifyPassword(string, hash) {
	return await argon2.verify(hash, string);
}

export async function createUser(userData) {
	if (await usernameExists(userData.username)) {
		throw new Error('DUPLICATE_USERNAME');
	}
	if (await emailExists(userData.email)) {
		throw new Error('DUPLICATE_EMAIL');
	}
	const emailIsValid = isValidEmail(userData.email);
	if (!emailIsValid) {
		throw new Error('INVALID_EMAIL');
	}

	const passwordHash = await hashString(userData.password);
	userData.password = passwordHash;

	const [user] = await db.insert(userTable).values(userData).returning();
	return user;
}

export async function createSession(userId) {
	const id = randomString(64);
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 7 days
	const [session] = await db.insert(sessionTable).values({ id, userId, expiresAt }).returning();

	return session;
}

export function setSession(setCookieFn, session) {
	if (!session) {
		return setCookieFn('session', '', {
			path: '/',
			maxAge: 0
		});
	}
	const cookieExpires = parseInt((session.expiresAt - new Date()) / 1000);
	setCookieFn('session', session.id, {
		path: '/',
		maxAge: cookieExpires
	});
}

export async function getSession(sessionId) {
	const [session] = await db.select().from(sessionTable).where(eq(sessionTable.id, sessionId));
	return session;
}

export async function createEmailVerificationToken(userId) {
	const storedUserTokens = await db
		.select()
		.from(emailVerificationTokenTable)
		.where(eq(emailVerificationTokenTable.userId, userId));

	if (storedUserTokens.length > 0) {
		const storedTokenWithinExpiry = storedUserTokens.find((token) => token.expiresAt > new Date());
		if (storedTokenWithinExpiry) {
			return storedTokenWithinExpiry.id;
		}
	}

	const id = randomString(64);
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
	await db.insert(emailVerificationTokenTable).values({ id, userId, expiresAt });

	return id;
}

export async function validateEmailVerificationToken(token) {
	const [storedToken] = await db
		.delete(emailVerificationTokenTable)
		.where(eq(emailVerificationTokenTable.id, token))
		.returning();

	const tokenExpired = storedToken.expiresAt < new Date();
	if (tokenExpired) {
		throw new Error('TOKEN_EXPIRED');
	}
	return storedToken.userId;
}

export async function createPasswordResetToken(userId) {
	const storedUserTokens = await db
		.select()
		.from(passwordResetTokenTable)
		.where(eq(passwordResetTokenTable.userId, userId));

	if (storedUserTokens.length > 0) {
		const storedTokenWithinExpiry = storedUserTokens.find((token) => token.expiresAt > new Date());
		if (storedTokenWithinExpiry) {
			return storedTokenWithinExpiry.id;
		}
	}

	const id = randomString(64);
	const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours
	await db.insert(passwordResetTokenTable).values({ id, userId, expiresAt });

	return id;
}

export async function validatePasswordResetToken(token) {
	const [storedToken] = await db
		.delete(passwordResetTokenTable)
		.where(eq(passwordResetTokenTable.id, token))
		.returning();

	const tokenExpired = storedToken.expiresAt < new Date();
	if (tokenExpired) {
		throw new Error('TOKEN_EXPIRED');
	}
	return storedToken.userId;
}

export async function getUserBySessionId(sessionId) {
	const session = await getSession(sessionId);
	if (!session) {
		return;
	}
	const [user] = await db.select().from(userTable).where(eq(userTable.id, session.userId));
	return user;
}

export async function getUserById(userId) {
	const [user] = await db.select().from(userTable).where(eq(userTable.id, userId));
	return user;
}

export async function getUserByUsername(username) {
	const [user] = await db.select().from(userTable).where(eq(userTable.username, username));
	return user;
}

export async function getUserByEmail(email) {
	const [user] = await db.select().from(userTable).where(eq(userTable.email, email));
	return user;
}

export async function invalidateAllUserSessions(userId) {
	await db.delete(sessionTable).where(eq(sessionTable.userId, userId));
}

export async function invalidateSession(sessionId) {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export async function usernameExists(username) {
	const [user] = await db.select().from(userTable).where(eq(username, userTable.username));
	return Boolean(user);
}
export async function emailExists(email) {
	const [user] = await db.select().from(userTable).where(eq(email, userTable.email));
	return Boolean(user);
}
