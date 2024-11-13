import { type Database } from './types';
import pg from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { DATABASE_URL } from '$env/static/private';

const pool = new pg.Pool({
	connectionString: DATABASE_URL
});

const dialect = new PostgresDialect({
	pool
});

export const db = new Kysely<Database>({ dialect });
