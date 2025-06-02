import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
}
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});
// Test the connection
pool.on('connect', () => {
    console.log('Connected to the database');
});
pool.on('error', (err) => {
    console.error('Database connection error:', err);
});
export const db = drizzle(pool);
//# sourceMappingURL=db.js.map