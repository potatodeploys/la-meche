import * as dotenv from 'dotenv';
dotenv.config();
export default {
    schema: './shared/schema.ts',
    out: './drizzle',
    driver: 'pg',
    dbCredentials: {
        connectionString: process.env.DATABASE_URL,
    },
};
//# sourceMappingURL=drizzle.config.js.map