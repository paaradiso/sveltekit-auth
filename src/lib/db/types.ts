import type { Insertable, Selectable, Updateable, Generated, GeneratedAlways } from 'kysely';

export interface Database {
	user: UserTable;
}

export interface UserTable {
	id: string;
	username: string;
	email: string;
	password: string;
	created_at: GeneratedAlways<Date>;
}

export type User = Selectable<UserTable>;
export type NewUser = Insertable<UserTable>;
export type UserUpdate = Updateable<UserTable>;

export interface SessionTable {
	id: string;
	user_id: string;
	created_at: GeneratedAlways<Date>;
	expires_at: Date;
	updated_at: Generated<Date>;
}

export type Session = Selectable<SessionTable>;
export type NewSession = Insertable<SessionTable>;
export type SessionUpdate = Updateable<SessionTable>;
