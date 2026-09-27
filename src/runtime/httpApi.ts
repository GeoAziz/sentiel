import { Router } from "express";
import type { Request, Response } from "express";
import { MockSentinelRuntime } from "./mockSentinel";
import { isGeminiConfigured } from "./geminiAdvisor";
import type { AuthorizationRequest } from "../types/sentinel";

function sendRuntimeError(res: Response, error: unknown): void {
  const message = error instanceof Error ? error.message : "Mock runtime error";
  const status = message.startsWith("Unknown ")
    ? 404
    : message.startsWith("Only pending")
      ? 409
      : 400;
  res.status(status).json({ error: message, mockOnly: true });
}

export function createMockApiRouter(
  runtime = new MockSentinelRuntime(),
): Router {
  const router = Router();

  router.get("/api/health", (_req, res) => {
    res.json({
      status: "online",
      version: "0.5.0-mock",
      mockOnly: true,
      enforcementActive: false,
      geminiAttached: isGeminiConfigured(),
      timestamp: new Date().toISOString(),
    });
  });

  router.get("/api/config", (_req, res) => {
    res.json({ ...runtime.getConfig(), mockOnly: true });
  });

  router.put("/api/config", (req: Request, res: Response) => {
    try {
      runtime.updateConfig(req.body?.agents, req.body?.policies);
      res.json({ ...runtime.getConfig(), mockOnly: true });
    } catch (error) {
      sendRuntimeError(res, error);
    }
  });

  router.post("/authorize", async (req: Request, res: Response) => {
    try {
      const event = await runtime.authorize(req.body as AuthorizationRequest);
      res.status(201).json({
        decision: event.decision,
        policy: event.policy,
        event_id: event.id,
        analysis: event.analysis,
        event,
        mockOnly: true,
      });
    } catch (error) {
      sendRuntimeError(res, error);
    }
  });

  router.get("/events", (_req, res) => {
    res.json({ events: runtime.listEvents(), mockOnly: true });
  });

  router.get("/events/stream", (req: Request, res: Response) => {
    res.status(200);
    res.set({
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    });
    res.flushHeaders();
    res.write(
      `data: ${JSON.stringify({ type: "CONNECTED", mockOnly: true })}\n\n`,
    );

    const send = (event: unknown) =>
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    runtime.listEvents().reverse().forEach(send);
    const unsubscribe = runtime.subscribe(send);
    const heartbeat = setInterval(() => res.write(": keep-alive\n\n"), 15000);

    req.on("close", () => {
      clearInterval(heartbeat);
      unsubscribe();
    });
  });

  router.post("/events/:id/approve", (req: Request, res: Response) => {
    const { outcome, by, reason } = req.body ?? {};
    if (
      (outcome !== "APPROVED" && outcome !== "DENIED") ||
      typeof by !== "string" ||
      !by.trim() ||
      by.length > 200 ||
      (reason !== undefined &&
        (typeof reason !== "string" || reason.length > 1000))
    ) {
      res
        .status(400)
        .json({
          error: "outcome and by are required; reason must be text",
          mockOnly: true,
        });
      return;
    }

    try {
      const event = runtime.resolveApproval(
        req.params.id,
        outcome,
        by.trim(),
        reason?.trim() || `Mock operator ${outcome.toLowerCase()} the request.`,
      );
      res.json({ event, mockOnly: true });
    } catch (error) {
      sendRuntimeError(res, error);
    }
  });

  router.get("/events/:id/status", (req: Request, res: Response) => {
    try {
      res.json({ ...runtime.getStatus(req.params.id), mockOnly: true });
    } catch (error) {
      sendRuntimeError(res, error);
    }
  });

  router.post("/api/demo/reset", (_req, res) => {
    runtime.reset();
    res.json({ reset: true, ...runtime.getConfig(), mockOnly: true });
  });

  return router;
}
