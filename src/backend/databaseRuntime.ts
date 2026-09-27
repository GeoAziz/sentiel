import { and, desc, eq, sql } from "drizzle-orm";
import { MockSentinelRuntime } from "../runtime/mockSentinel";
import { approvals, securityEvents } from "../db/schema";
import { getDbClient } from "../db/connection";
import type { SecurityEvent } from "../types/sentinel";

export class DatabaseRuntime extends MockSentinelRuntime {
  override authorize(request: Parameters<MockSentinelRuntime["authorize"]>[0]) {
    const event = super.authorize(request);
    void this.persistEvent(event);
    return event;
  }

  override resolveApproval(
    eventId: string,
    outcome: "APPROVED" | "DENIED",
    by: string,
    reason: string,
  ) {
    const event = super.resolveApproval(eventId, outcome, by, reason);
    void this.persistApproval(eventId, outcome, by, reason, event.ts);
    return event;
  }

  override listEvents() {
    return super.listEvents();
  }

  override reset(): void {
    super.reset();
    void this.clearPersistedState();
  }

  private async persistEvent(event: SecurityEvent): Promise<void> {
    const db = await getDbClient();
    if (!db) return;

    await db
      .insert(securityEvents)
      .values({
        id: event.id,
        agentId: event.agent.id,
        capability: event.capability,
        action: event.action,
        resource: event.resource,
        decision: event.decision,
        status: event.status,
        policyId: event.policy.id,
        policyName: event.policy.name,
        policyReason: event.policy.reason,
        sourceOrigin: event.source.origin,
        sourceTrust: event.source.trust,
        promptSnippet: event.source.promptSnippet ?? null,
        timeline: event.timeline,
        dataExposed: event.dataExposed,
        analysis: event.analysis ?? null,
        hash: event.hash,
      })
      .onConflictDoUpdate({
        target: securityEvents.id,
        set: {
          capability: event.capability,
          action: event.action,
          resource: event.resource,
          decision: event.decision,
          status: event.status,
          policyId: event.policy.id,
          policyName: event.policy.name,
          policyReason: event.policy.reason,
          sourceOrigin: event.source.origin,
          sourceTrust: event.source.trust,
          promptSnippet: event.source.promptSnippet ?? null,
          timeline: event.timeline,
          dataExposed: event.dataExposed,
          analysis: event.analysis ?? null,
          hash: event.hash,
        },
      });
  }

  private async persistApproval(
    eventId: string,
    outcome: "APPROVED" | "DENIED",
    by: string,
    reason: string,
    resolvedAt: string,
  ): Promise<void> {
    const db = await getDbClient();
    if (!db) return;

    await db.insert(approvals).values({
      eventId,
      outcome,
      operator: by,
      reason,
      resolvedAt: new Date(resolvedAt),
    }).onConflictDoNothing();
  }

  private async clearPersistedState(): Promise<void> {
    const db = await getDbClient();
    if (!db) return;

    await db.delete(approvals);
    await db.delete(securityEvents);
  }
}
