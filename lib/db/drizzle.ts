import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.POSTGRES_URL) {
  throw new Error('POSTGRES_URL environment variable is not set');
}

const postgresUrl = process.env.POSTGRES_URL;

// Configure SSL based on environment
const sslConfig = process.env.NODE_ENV === 'production' 
  ? {
      rejectUnauthorized: false, // Allow self-signed certificates in production
    }
  : true;

export const client = postgres(postgresUrl, {
  ssl: true,
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
