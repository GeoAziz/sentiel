import { DatabaseRuntime } from "./databaseRuntime";
import { getDbClient } from "../db/connection";
import { seedDatabase } from "../db/seed";

export type BackendMode = "memory" | "postgres";

export function getBackendMode(): BackendMode {
  return process.env.DATABASE_URL ? "postgres" : "memory";
}

export function createRuntime() {
  return new DatabaseRuntime();
}

export async function initializeBackendRuntime() {
  const mode = getBackendMode();

  if (mode === "postgres") {
    try {
      const db = await getDbClient();
      if (db) {
        await seedDatabase();
        return { mode, databaseConfigured: true, initialized: true, mockOnly: true };
      }
    } catch (error) {
      console.warn("Database initialization failed; falling back to in-memory backend.", error);
    }
  }

  return {
    mode: "memory",
    databaseConfigured: false,
    initialized: true,
    mockOnly: true,
  };
}

export function createRuntimeStatus() {
  return {
    mode: getBackendMode(),
    databaseConfigured: Boolean(process.env.DATABASE_URL),
    mockOnly: true,
  };
}
