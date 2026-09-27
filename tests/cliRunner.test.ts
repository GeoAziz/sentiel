import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
import { runMockCliAction } from "../src/runtime/cliRunner";
import { createMockApiRouter } from "../src/runtime/httpApi";
import { MockSentinelRuntime } from "../src/runtime/mockSentinel";

async function withApi(run: (baseUrl: string) => Promise<void>) {
  const app = express();
  app.use(express.json());
  app.use(createMockApiRouter(new MockSentinelRuntime()));
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  if (!address || typeof address === "string")
    throw new Error("API server did not bind");
  try {
    await run(`http://127.0.0.1:${address.port}`);
  } finally {
    await new Promise<void>((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
}

const adapterRequest = (resource: string, agentId = "agent_coding_01") => ({
  agent_id: agentId,
  capability:
    agentId === "agent_release_01" ? "deploy.production" : "filesystem.read",
  resource,
  action:
    agentId === "agent_release_01"
      ? "deploy production --tag=mock"
      : `read ${resource}`,
  context: {
    source: "mock CLI demo",
    trust: resource === ".env" ? ("UNTRUSTED" as const) : ("TRUSTED" as const),
  },
});

test("CLI never invokes its adapter for BLOCK", async () => {
  await withApi(async (apiBaseUrl) => {
    let calls = 0;
    const event = await runMockCliAction({
      apiBaseUrl,
      request: adapterRequest(".env"),
      mockToolAdapter: () => {
        calls += 1;
      },
    });
    assert.equal(event.decision, "BLOCK");
    assert.equal(calls, 0);
  });
});

test("CLI waits for human approval before invoking its adapter", async () => {
  await withApi(async (apiBaseUrl) => {
    let calls = 0;
    const action = runMockCliAction({
      apiBaseUrl,
      request: adapterRequest("production", "agent_release_01"),
      pollIntervalMs: 5,
      maxPollAttempts: 20,
      onReview: async (event) => {
        await fetch(`${apiBaseUrl}/events/${event.id}/approve`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ outcome: "APPROVED", by: "test operator" }),
        });
      },
      mockToolAdapter: () => {
        calls += 1;
      },
    });
    const event = await action;
    assert.equal(event.decision, "ALLOW");
    assert.equal(calls, 1);
  });
});
