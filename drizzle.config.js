import { defineConfig } from 'drizzle-kit';
import { config } from 'dotenv';
config();

export default defineConfig({
	dialect: 'postgresql', // "mysql" | "sqlite"
	schema: './src/lib/db/schema.js',
	out: './drizzle',
	dbCredentials: {
		url: process.env.DATABASE_URL
	}
});
