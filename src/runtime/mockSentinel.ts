import { INITIAL_AGENTS, INITIAL_POLICIES } from "../data/initialData";
import { evaluateRequest, generateHash } from "../utils/engine";
import type {
  Agent,
  AISecurityAnalysis,
  AuthorizationRequest,
  Decision,
  Policy,
  SecurityEvent,
  TrustLevel,
} from "../types/sentinel";

export type EventRecord =
  | { kind: "DECISION"; event: SecurityEvent }
  | {
      kind: "APPROVAL";
      eventId: string;
      outcome: "APPROVED" | "DENIED";
      by: string;
      reason: string;
      resolvedAt: string;
    };

const clone = <T>(value: T): T => structuredClone(value);

function analyzeMock(
  request: AuthorizationRequest,
  decision: Decision,
): AISecurityAnalysis {
  const resource = request.resource.toLowerCase();
  const isSecret = /\.env|\.ssh|secret|credential|id_rsa|aws|token/.test(resource);
  const isDestructive = /rm\s+-rf|drop\s+(table|database)|--force|format/.test(resource);
  const untrusted = request.context?.trust === "UNTRUSTED";
  const risk = isDestructive ? "CRITICAL" : isSecret ? "HIGH" : decision === "REVIEW" ? "MEDIUM" : "LOW";

  return {
    intent: isSecret ? "Access protected configuration or credentials" : "Request a simulated agent capability",
    threat: isDestructive
      ? "Destructive operation"
      : untrusted && isSecret
        ? "Untrusted-origin secret access"
        : isSecret
          ? "Protected secret access"
          : decision === "REVIEW"
            ? "Human approval required"
            : "No simulated threat detected",
    risk,
    confidence: 94,
    recommendation: decision,
    reasoning: "Deterministic mock advisory. The policy engine alone determines the final decision.",
    mitreAtlasId: isSecret ? "AML.T0051" : undefined,
    engine: "sentinel-mock-advisory",
  };
}

export class MockSentinelRuntime {
  private readonly records: EventRecord[] = [];
  private readonly listeners = new Set<(event: SecurityEvent) => void>();
  private agents: Agent[];
  private policies: Policy[];

  constructor(
    agents: Agent[] = INITIAL_AGENTS,
    policies: Policy[] = INITIAL_POLICIES,
  ) {
    this.agents = clone(agents);
    this.policies = clone(policies);
  }

  getConfig(): { agents: Agent[]; policies: Policy[] } {
    return clone({ agents: this.agents, policies: this.policies });
  }

  updateConfig(agents: unknown, policies: unknown): void {
    if (
      !Array.isArray(agents) ||
      !Array.isArray(policies) ||
      agents.length > 100 ||
      policies.length > 100 ||
      agents.some((agent) => !agent || typeof agent.id !== "string" || typeof agent.name !== "string" || typeof agent.policyId !== "string") ||
      policies.some((policy) => !policy || typeof policy.id !== "string" || typeof policy.name !== "string" || !Array.isArray(policy.groups))
    ) {
      throw new Error("Invalid mock configuration");
    }
    const policyIds = new Set(policies.map((policy) => policy.id));
    if (agents.some((agent) => !policyIds.has(agent.policyId))) {
      throw new Error("Every mock agent must reference an existing policy");
    }
    this.agents = clone(agents as Agent[]);
    this.policies = clone(policies as Policy[]);
  }

  authorize(request: AuthorizationRequest): SecurityEvent {
    if (
      !request ||
      typeof request.agent_id !== "string" ||
      typeof request.capability !== "string" ||
      typeof request.resource !== "string" ||
      !request.agent_id.trim() ||
      !request.capability.trim() ||
      !request.resource.trim() ||
      request.agent_id.length > 100 ||
      request.capability.length > 200 ||
      request.resource.length > 1000
    ) {
      throw new Error("agent_id, capability, and resource are required strings within size limits");
    }

    const agent = this.agents.find((candidate) => candidate.id === request.agent_id);
    if (!agent) throw new Error("Unknown agent");
    const agentUnavailable = agent.isolated || agent.status === "QUARANTINED" || agent.status === "SUSPENDED";

    const policy = this.policies.find((candidate) => candidate.id === agent.policyId);
    if (!policy) throw new Error("Agent policy is unavailable");

    const trust: TrustLevel = request.context?.trust === "TRUSTED" ? "TRUSTED" : "UNTRUSTED";
    const origin = request.context?.source?.trim() || "Unspecified mock request source";
    const combinedResource = `${request.resource} ${request.action || ""} ${request.capability}`;
    const result = agentUnavailable
      ? {
          decision: "BLOCK" as const,
          status: "PREVENTED" as const,
          policyId: policy.id,
          policyName: policy.name,
          reason: "Agent is isolated or inactive under the current mock configuration.",
          timeline: [
            { label: `Agent requested ${request.capability}("${request.resource}")`, state: "done" as const },
            { label: "Sentinel checked agent status", state: "done" as const },
            { label: "Agent is quarantined or suspended -> BLOCK", state: "done" as const, tone: "block" as const },
            { label: "Mock tool adapter not invoked", state: "done" as const, tone: "block" as const },
          ],
        }
      : evaluateRequest(
          agent,
          policy,
          request.capability,
          combinedResource,
          trust,
          origin,
        );
    const id = `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const ts = new Date().toISOString();
    const event: SecurityEvent = {
      id,
      ts,
      agent: { id: agent.id, name: agent.name, model: agent.model },
      capability: request.capability,
      action: request.action?.trim() || `${request.capability} ${request.resource}`,
      resource: request.resource,
      decision: result.decision,
      status: result.status,
      policy: { id: result.policyId, name: result.policyName, reason: result.reason },
      source: {
        origin,
        trust,
        promptSnippet: request.context?.promptSnippet,
      },
      timeline: result.timeline,
      dataExposed: 0,
      analysis: analyzeMock(request, result.decision),
      hash: generateHash("mock", id, ts),
    };

    this.records.push({ kind: "DECISION", event: clone(event) });
    this.publish(event);
    return clone(event);
  }

  resolveApproval(
    eventId: string,
    outcome: "APPROVED" | "DENIED",
    by: string,
    reason: string,
  ): SecurityEvent {
    if (outcome !== "APPROVED" && outcome !== "DENIED") {
      throw new Error("Invalid approval outcome");
    }
    const original = this.findOriginal(eventId);
    if (!original) throw new Error("Unknown event");
    if (original.decision !== "REVIEW" || original.status !== "PENDING") {
      throw new Error("Only pending REVIEW events can be resolved");
    }
    if (this.findApproval(eventId)) throw new Error("Approval already resolved");

    const resolvedAt = new Date().toISOString();
    const approval = { outcome, resolvedAt, operator: by, reason } as const;
    this.records.push({
      kind: "APPROVAL",
      eventId,
      outcome,
      by,
      reason,
      resolvedAt,
    });
    const updated: SecurityEvent = {
      ...clone(original),
      decision: outcome === "APPROVED" ? "ALLOW" : "BLOCK",
      status: "RESOLVED",
      approval,
      timeline: [
        ...original.timeline.filter((step) => step.state !== "active"),
        {
          label: outcome === "APPROVED" ? "Operator approved mock execution" : "Operator denied mock execution",
          state: "done",
          tone: outcome === "APPROVED" ? "allow" : "block",
        },
        {
          label: outcome === "APPROVED" ? "Mock tool adapter may proceed" : "Mock tool adapter remains blocked",
          state: "done",
          tone: outcome === "APPROVED" ? "allow" : "block",
        },
      ],
    };
    this.publish(updated);
    return clone(updated);
  }

  getStatus(eventId: string): { status: "PENDING" | "RESOLVED"; outcome?: "APPROVED" | "DENIED" } {
    const original = this.findOriginal(eventId);
    if (!original) throw new Error("Unknown event");
    const approval = this.findApproval(eventId);
    return approval
      ? { status: "RESOLVED", outcome: approval.outcome }
      : { status: original.status === "PENDING" ? "PENDING" : "RESOLVED" };
  }

  listEvents(): SecurityEvent[] {
    return this.records
      .filter((record): record is Extract<EventRecord, { kind: "DECISION" }> => record.kind === "DECISION")
      .map(({ event }) => {
        const approval = this.findApproval(event.id);
        if (!approval) return clone(event);
        return this.projectResolved(clone(event), approval);
      })
      .reverse();
  }

  listRecords(): EventRecord[] {
    return clone(this.records);
  }

  subscribe(listener: (event: SecurityEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  reset(): void {
    this.records.splice(0, this.records.length);
    this.agents = clone(INITIAL_AGENTS);
    this.policies = clone(INITIAL_POLICIES);
  }

  private findOriginal(eventId: string): SecurityEvent | undefined {
    const record = this.records.find(
      (item): item is Extract<EventRecord, { kind: "DECISION" }> =>
        item.kind === "DECISION" && item.event.id === eventId,
    );
    return record ? clone(record.event) : undefined;
  }

  private findApproval(eventId: string): Extract<EventRecord, { kind: "APPROVAL" }> | undefined {
    return this.records.find(
      (item): item is Extract<EventRecord, { kind: "APPROVAL" }> =>
        item.kind === "APPROVAL" && item.eventId === eventId,
    );
  }

  private projectResolved(
    event: SecurityEvent,
    record: Extract<EventRecord, { kind: "APPROVAL" }>,
  ): SecurityEvent {
    return {
      ...event,
      decision: record.outcome === "APPROVED" ? "ALLOW" : "BLOCK",
      status: "RESOLVED",
      approval: {
        outcome: record.outcome,
        resolvedAt: record.resolvedAt,
        operator: record.by,
        reason: record.reason,
      },
      timeline: [
        ...event.timeline.filter((step) => step.state !== "active"),
        {
          label: record.outcome === "APPROVED" ? "Operator approved mock execution" : "Operator denied mock execution",
          state: "done",
          tone: record.outcome === "APPROVED" ? "allow" : "block",
        },
        {
          label: record.outcome === "APPROVED" ? "Mock tool adapter may proceed" : "Mock tool adapter remains blocked",
          state: "done",
          tone: record.outcome === "APPROVED" ? "allow" : "block",
        },
      ],
    };
  }

  private publish(event: SecurityEvent): void {
    for (const listener of this.listeners) listener(clone(event));
  }
}
