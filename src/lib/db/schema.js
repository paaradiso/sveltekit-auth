import { sql } from 'drizzle-orm';
import { pgTable, integer, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
export const userTable = pgTable('user', {
	id: varchar('id').primaryKey(),
	username: varchar('username'),
	email: varchar('email'),
	password: varchar('password'),
	createdAt: timestamp('created_at').defaultNow(),
	emailVerified: boolean('email_verified').default(false)
});

export const sessionTable = pgTable('session', {
	id: varchar('id').primaryKey(),
	userId: varchar('user_id').references(() => userTable.id),
	createdAt: timestamp('created_at').defaultNow(),
	expiresAt: timestamp('expires_at'),
	updatedAt: timestamp('updated_at').defaultNow()
});

export const emailVerificationTokenTable = pgTable('email_verification_token', {
	id: varchar('id').primaryKey(),
	userId: varchar('user_id').references(() => userTable.id),
	expiresAt: timestamp('expires_at').default(sql`now() + interval '24 hours'`)
});

export const passwordResetTokenTable = pgTable('password_reset_token', {
	id: varchar('id').primaryKey(),
	userId: varchar('user_id').references(() => userTable.id),
	expiresAt: timestamp('expires_at').default(sql`now() + interval '24 hours'`)
});
