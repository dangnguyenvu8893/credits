import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const postgresUrl = process.env.POSTGRES_URL;

export const client = postgres(postgresUrl, {
  ssl: 'require',
  max: 1,
});

export const db = drizzle(client, { schema });
