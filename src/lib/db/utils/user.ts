import { db } from '$lib/db/db';
import { type NewUser } from '$lib/db/types';
import { v7 as uuidv7 } from 'uuid';

export async function createUser(userData: Omit<NewUser, 'id'>) {
	return await db
		.insertInto('user')
		.values({ ...userData, id: uuidv7() })
		.returningAll()
		.executeTakeFirst();
}
