import { hash, verify } from 'argon2';

const HASH_OPTIONS = {
	// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html#argon2id
	memoryCost: 19456,
	timeCost: 2,
	parallelism: 1
} as const;

export async function createHash(input: Buffer | string) {
	return await hash(input, HASH_OPTIONS);
}

export async function verifyHash(hash: string, input: Buffer | string) {
	return await verify(hash, input);
}
