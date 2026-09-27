import assert from "node:assert/strict";
import test from "node:test";
import { evaluateRequest, generateHash, matchPattern } from "../src/utils/engine";
import type { Agent, Policy } from "../src/types/sentinel";

const agent: Agent = {
  id: "agent_test_01",
  name: "Test Agent",
  model: "test-model",
  environment: "Development",
  status: "ACTIVE",
  risk: "Controlled",
  policyId: "policy_test",
  policyName: "Test Policy",
  capabilities: [],
  requestsCount: 0,
  blockedCount: 0,
};

function makePolicy(rules: Partial<Policy["groups"][0]["rules"][0]>[]): Policy {
  return {
    id: "policy_test",
    name: "Test Policy",
    appliesTo: "test",
    groups: [
      {
        name: "default",
        rules: rules.map((rule, index) => ({
          id: `rule_${index}`,
          res: "src/**",
          dec: "ALLOW",
          enabled: true,
          ...rule,
        })),
      },
    ],
  };
}

test("matchPattern supports glob wildcards", () => {
  assert.equal(matchPattern("src/**", "src/utils/engine.ts"), true);
  assert.equal(matchPattern("*.env", ".env"), true);
  assert.equal(matchPattern("src/**", "other/file.ts"), false);
  assert.equal(matchPattern("*", "anything"), true);
});

test("evaluateRequest returns ALLOW for a matched allow rule and is not ambiguous", () => {
  const policy = makePolicy([{ res: "src/**", dec: "ALLOW" }]);
  const result = evaluateRequest(
    agent,
    policy,
    "filesystem.read",
    "src/auth.ts",
    "TRUSTED",
    "operator task",
  );
  assert.equal(result.decision, "ALLOW");
  assert.equal(result.ambiguous, undefined);
});

test("evaluateRequest returns REVIEW and flags the result as ambiguous", () => {
  const policy = makePolicy([{ res: "deploy.production", dec: "REVIEW" }]);
  const result = evaluateRequest(
    agent,
    policy,
    "deploy.production",
    "production",
    "TRUSTED",
    "release pipeline",
  );
  assert.equal(result.decision, "REVIEW");
  assert.equal(result.ambiguous, true);
});

test("evaluateRequest default-denies unmatched capabilities and flags ambiguity", () => {
  const policy = makePolicy([{ res: "src/**", dec: "ALLOW" }]);
  const result = evaluateRequest(
    agent,
    policy,
    "network.exfiltrate",
    "https://unknown-host.example",
    "TRUSTED",
    "operator task",
  );
  assert.equal(result.decision, "BLOCK");
  assert.equal(result.ambiguous, true);
  assert.match(result.reason, /Default Deny/);
});

test("evaluateRequest blocks untrusted-origin secret access via taint check before rule matching", () => {
  const policy = makePolicy([{ res: "*", dec: "ALLOW" }]);
  const result = evaluateRequest(
    agent,
    policy,
    "filesystem.read",
    ".env",
    "UNTRUSTED",
    "untrusted repository content",
  );
  assert.equal(result.decision, "BLOCK");
  assert.match(result.reason, /taint/i);
});

test("evaluateRequest blocks destructive commands from untrusted origins", () => {
  const policy = makePolicy([{ res: "*", dec: "ALLOW" }]);
  const result = evaluateRequest(
    agent,
    policy,
    "shell.exec",
    "rm -rf /data",
    "UNTRUSTED",
    "untrusted repository content",
  );
  assert.equal(result.decision, "BLOCK");
});

test("evaluateRequest enforces requireTrustedOrigin even when the rule itself allows", () => {
  const policy = makePolicy([
    { res: "deploy.production", dec: "ALLOW", requireTrustedOrigin: true },
  ]);
  const result = evaluateRequest(
    agent,
    policy,
    "deploy.production",
    "production",
    "UNTRUSTED",
    "unverified pull request",
  );
  assert.equal(result.decision, "BLOCK");
});

test("generateHash produces a stable, non-cryptographic mock-prefixed fingerprint", () => {
  const hash = generateHash("mock", "evt_1", "2026-01-01T00:00:00.000Z");
  assert.match(hash, /^mock-[0-9a-f]{8}$/);
  assert.equal(
    generateHash("mock", "evt_1", "2026-01-01T00:00:00.000Z"),
    hash,
  );
});
