import assert from "node:assert/strict";
import test from "node:test";
import { MockSentinelRuntime } from "../src/runtime/mockSentinel";

const request = (overrides: Record<string, unknown> = {}) => ({
  agent_id: "agent_coding_01",
  capability: "filesystem.read",
  resource: "src/auth.ts",
  context: { source: "operator task", trust: "TRUSTED" as const },
  ...overrides,
});

test("allows an in-policy mock source read", () => {
  const runtime = new MockSentinelRuntime();
  const event = runtime.authorize(request());
  assert.equal(event.decision, "ALLOW");
  assert.equal(event.status, "RESOLVED");
  assert.equal(runtime.listRecords().length, 1);
});

test("blocks secret reads from untrusted context", () => {
  const runtime = new MockSentinelRuntime();
  const event = runtime.authorize(request({
    resource: ".env",
    context: { source: "untrusted repository content", trust: "UNTRUSTED" },
  }));
  assert.equal(event.decision, "BLOCK");
  assert.equal(event.status, "PREVENTED");
  assert.match(event.policy.reason, /untrusted|secret|inaccessible/i);
});

test("holds production deployment for review and appends approval without changing decision record", () => {
  const runtime = new MockSentinelRuntime();
  const event = runtime.authorize(request({
    agent_id: "agent_release_01",
    capability: "deploy.production",
    resource: "production",
    action: "deploy production --tag=mock-v1",
    context: { source: "mock release pipeline", trust: "TRUSTED" },
  }));
  assert.equal(event.decision, "REVIEW");
  assert.equal(runtime.getStatus(event.id).status, "PENDING");

  const resolved = runtime.resolveApproval(event.id, "APPROVED", "demo operator", "Approved for demo");
  assert.equal(resolved.decision, "ALLOW");
  assert.equal(runtime.getStatus(event.id).outcome, "APPROVED");
  const records = runtime.listRecords();
  assert.equal(records.length, 2);
  assert.equal(records[0].kind, "DECISION");
  if (records[0].kind === "DECISION") assert.equal(records[0].event.decision, "REVIEW");
  assert.equal(records[1].kind, "APPROVAL");
  assert.throws(
    () => runtime.resolveApproval(event.id, "DENIED", "another operator", "duplicate"),
    /already resolved/,
  );
});

test("rejects approval for a blocked request", () => {
  const runtime = new MockSentinelRuntime();
  const event = runtime.authorize(request({ resource: ".env" }));
  assert.throws(
    () => runtime.resolveApproval(event.id, "APPROVED", "operator", "reason"),
    /Only pending REVIEW/,
  );
  assert.equal(runtime.listRecords().length, 1);
});

test("rejects unknown agents and malformed authorization requests", () => {
  const runtime = new MockSentinelRuntime();
  assert.throws(() => runtime.authorize(request({ agent_id: "missing" })), /Unknown agent/);
  assert.throws(() => runtime.authorize(request({ resource: "" })), /required strings/);
});

test("updated mock policy configuration controls later authorization decisions", () => {
  const runtime = new MockSentinelRuntime();
  const config = runtime.getConfig();
  config.policies[0].groups[0].rules[0].dec = "BLOCK";
  runtime.updateConfig(config.agents, config.policies);
  assert.equal(runtime.authorize(request()).decision, "BLOCK");

  runtime.reset();
  assert.equal(runtime.authorize(request()).decision, "ALLOW");
});

test("requires trusted provenance when a matched policy rule says so", () => {
  const runtime = new MockSentinelRuntime();
  const config = runtime.getConfig();
  config.policies[0].groups[0].rules[0].requireTrustedOrigin = true;
  runtime.updateConfig(config.agents, config.policies);
  const event = runtime.authorize(request({
    context: { source: "untrusted pull request", trust: "UNTRUSTED" },
  }));
  assert.equal(event.decision, "BLOCK");
});

test("records quarantined agent requests as blocked decisions", () => {
  const runtime = new MockSentinelRuntime();
  const event = runtime.authorize(request({ agent_id: "agent_redteam_01" }));
  assert.equal(event.decision, "BLOCK");
  assert.equal(event.status, "PREVENTED");
  assert.equal(runtime.listRecords().length, 1);
});
