import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@shared/schema";

declare global {
  // eslint-disable-next-line no-var
  var __db: ReturnType<typeof drizzle> | undefined;
  // eslint-disable-next-line no-var
  var __pool: Pool | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Singleton pattern for Next.js to prevent multiple connections
let pool: Pool;
let db: ReturnType<typeof drizzle>;

if (process.env.NODE_ENV === "production") {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
  db = drizzle(pool, { schema });
} else {
  if (!global.__pool) {
    global.__pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  pool = global.__pool;

  if (!global.__db) {
    global.__db = drizzle(pool, { schema });
  }
  db = global.__db;
}

export { pool, db };
