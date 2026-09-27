import assert from "node:assert/strict";
import test from "node:test";
import express from "express";
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

test("authorization route records and publishes a deterministic mock decision", async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/authorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent_id: "agent_coding_01",
        capability: "filesystem.read",
        resource: ".env",
        context: { source: "untrusted repository", trust: "UNTRUSTED" },
      }),
    });
    const payload = (await response.json()) as {
      decision: string;
      event_id: string;
      mockOnly: boolean;
    };
    assert.equal(response.status, 201);
    assert.equal(payload.decision, "BLOCK");
    assert.equal(payload.mockOnly, true);

    const eventResponse = await fetch(`${baseUrl}/events`);
    const eventPayload = (await eventResponse.json()) as {
      events: Array<{ id: string }>;
    };
    assert.equal(eventPayload.events[0].id, payload.event_id);
  });
});

test("approval endpoint resolves REVIEW and status is visible to polling clients", async () => {
  await withApi(async (baseUrl) => {
    const created = await fetch(`${baseUrl}/authorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent_id: "agent_release_01",
        capability: "deploy.production",
        resource: "production",
        action: "deploy production --tag=mock-v1",
        context: { source: "mock release pipeline", trust: "TRUSTED" },
      }),
    });
    const createdPayload = (await created.json()) as {
      decision: string;
      event_id: string;
    };
    assert.equal(createdPayload.decision, "REVIEW");

    const approval = await fetch(
      `${baseUrl}/events/${createdPayload.event_id}/approve`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ outcome: "APPROVED", by: "test operator" }),
      },
    );
    assert.equal(approval.status, 200);

    const status = await fetch(
      `${baseUrl}/events/${createdPayload.event_id}/status`,
    );
    assert.deepEqual(await status.json(), {
      status: "RESOLVED",
      outcome: "APPROVED",
      mockOnly: true,
    });
  });
});

test("SSE sends new decisions to connected clients", async () => {
  await withApi(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/events/stream`);
    const reader = response.body?.getReader();
    assert.ok(reader);
    const decoder = new TextDecoder();
    const first = await reader.read();
    assert.match(decoder.decode(first.value), /CONNECTED/);

    const authorized = fetch(`${baseUrl}/authorize`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agent_id: "agent_coding_01",
        capability: "filesystem.read",
        resource: "src/auth.ts",
        context: { source: "operator task", trust: "TRUSTED" },
      }),
    });
    const next = await reader.read();
    const nextText = decoder.decode(next.value);
    const authorization = await authorized;
    assert.equal(authorization.status, 201);
    assert.match(nextText, /src\/auth\.ts/);
    await reader.cancel();
  });
});
