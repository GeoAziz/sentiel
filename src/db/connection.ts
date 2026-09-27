import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

export type DbClient = ReturnType<typeof drizzle<typeof schema>> | null;

let cachedClient: DbClient | null | undefined;

export async function getDbClient(): Promise<DbClient> {
  if (cachedClient !== undefined) return cachedClient;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    cachedClient = null;
    return cachedClient;
  }

  try {
    const pool = new Pool({
      connectionString,
      max: 5,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    await pool.query("SELECT 1");
    cachedClient = drizzle(pool, { schema });
    return cachedClient;
  } catch (error) {
    console.warn(
      "PostgreSQL not available, falling back to in-memory runtime.",
      error,
    );
    cachedClient = null;
    return cachedClient;
  }
}

export async function resetDbClient() {
  cachedClient = undefined;
}
