import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { sql } from "drizzle-orm";
import * as schema from "./schema";

async function main() {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgres://postgres:postgres@localhost:5432/sentinel";

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const db = drizzle(client, { schema });
    await db.execute(sql`CREATE TABLE IF NOT EXISTS workspaces (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      slug VARCHAR(128) NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
      email TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'operator',
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS agents (
      id TEXT PRIMARY KEY,
      workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      model TEXT NOT NULL,
      environment TEXT NOT NULL,
      status TEXT NOT NULL,
      risk TEXT NOT NULL,
      policy_id TEXT NOT NULL,
      policy_name TEXT NOT NULL,
      description TEXT,
      requests_count INTEGER NOT NULL DEFAULT 0,
      blocked_count INTEGER NOT NULL DEFAULT 0,
      isolated BOOLEAN NOT NULL DEFAULT FALSE,
      avatar_seed TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS agent_capabilities (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      agent_id TEXT REFERENCES agents(id) ON DELETE CASCADE,
      label TEXT NOT NULL,
      state TEXT NOT NULL,
      tool_name TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS policy_versions (
      id TEXT PRIMARY KEY,
      workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
      policy_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      applies_to TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      is_active BOOLEAN NOT NULL DEFAULT TRUE
    );`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS policy_rules (
      id TEXT PRIMARY KEY,
      policy_version_id TEXT REFERENCES policy_versions(id) ON DELETE CASCADE,
      group_name TEXT NOT NULL,
      resource_pattern TEXT NOT NULL,
      decision TEXT NOT NULL,
      require_trusted_origin BOOLEAN NOT NULL DEFAULT FALSE,
      explanation TEXT,
      enabled BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS security_events (
      id TEXT PRIMARY KEY,
      workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
      agent_id TEXT REFERENCES agents(id) ON DELETE SET NULL,
      capability TEXT NOT NULL,
      action TEXT NOT NULL,
      resource TEXT NOT NULL,
      decision TEXT NOT NULL,
      status TEXT NOT NULL,
      policy_id TEXT NOT NULL,
      policy_name TEXT NOT NULL,
      policy_reason TEXT NOT NULL,
      source_origin TEXT NOT NULL,
      source_trust TEXT NOT NULL,
      prompt_snippet TEXT,
      timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
      data_exposed INTEGER NOT NULL DEFAULT 0,
      analysis JSONB,
      hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS approvals (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      event_id TEXT REFERENCES security_events(id) ON DELETE CASCADE,
      outcome TEXT NOT NULL,
      operator TEXT NOT NULL,
      reason TEXT,
      resolved_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`);

    await db.execute(sql`CREATE TABLE IF NOT EXISTS audit_logs (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
      actor TEXT NOT NULL,
      action TEXT NOT NULL,
      target TEXT,
      metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );`);

    console.log("Postgres schema ensured successfully.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("Database migration failed:", error);
  process.exitCode = 1;
});
