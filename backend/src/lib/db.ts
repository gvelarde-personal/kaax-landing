import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../../shared/schema";

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function initializeDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }

  _pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 1, // Lambda: one connection per instance
  });

  _db = drizzle(_pool, { schema });
}

// Lazy getters
export const getPool = () => {
  if (!_pool) initializeDb();
  return _pool!;
};

export const getDb = () => {
  if (!_db) initializeDb();
  return _db!;
};

// Export for backwards compatibility
export const pool = new Proxy({} as Pool, {
  get(target, prop) {
    return (getPool() as any)[prop];
  },
});

export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(target, prop) {
    return (getDb() as any)[prop];
  },
});
