import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Simple connection pool (Lambda reuses connections)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1, // Lambda: one connection per instance
});

export const db = drizzle(pool, { schema });
export { pool };
