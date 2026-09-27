import assert from "node:assert/strict";
import test from "node:test";
import { DatabaseRuntime } from "../src/backend/databaseRuntime";

const request = (overrides: Record<string, unknown> = {}) => ({
  agent_id: "agent_coding_01",
  capability: "filesystem.read",
  resource: "src/auth.ts",
  context: { source: "operator task", trust: "TRUSTED" as const },
  ...overrides,
});

test("DatabaseRuntime falls back to in-memory behavior when DATABASE_URL is unset", async () => {
  assert.equal(process.env.DATABASE_URL, undefined);
  const runtime = new DatabaseRuntime();
  const event = await runtime.authorize(request());
  assert.equal(event.decision, "ALLOW");
  assert.equal(runtime.listEvents().length, 1);
});

test("DatabaseRuntime still resolves REVIEW approvals without a live database", async () => {
  const runtime = new DatabaseRuntime();
  const event = await runtime.authorize(
    request({
      agent_id: "agent_release_01",
      capability: "deploy.production",
      resource: "production",
      action: "deploy production --tag=mock-v1",
      context: { source: "mock release pipeline", trust: "TRUSTED" },
    }),
  );
  assert.equal(event.decision, "REVIEW");
  const resolved = await runtime.resolveApproval(
    event.id,
    "APPROVED",
    "demo operator",
    "Approved for demo",
  );
  assert.equal(resolved.decision, "ALLOW");
});

test("DatabaseRuntime reset does not throw without a live database", async () => {
  const runtime = new DatabaseRuntime();
  await runtime.authorize(request());
  assert.doesNotThrow(() => runtime.reset());
});
