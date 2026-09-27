import assert from "node:assert/strict";
import test from "node:test";
import { analyzeWithGemini, isGeminiConfigured } from "../src/runtime/geminiAdvisor";

test("Gemini advisor reports unconfigured when no real API key is present", () => {
  assert.equal(isGeminiConfigured(), false);
});

test("analyzeWithGemini returns null (triggering deterministic fallback) when unconfigured", async () => {
  const result = await analyzeWithGemini(
    {
      agent_id: "agent_test_01",
      capability: "network.exfiltrate",
      resource: "https://unknown-host.example",
      context: { source: "operator task", trust: "TRUSTED" },
    },
    { decision: "BLOCK", reason: "Default Deny: unmatched capability." },
  );
  assert.equal(result, null);
});
