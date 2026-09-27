import type { AuthorizationRequest, SecurityEvent } from "../types/sentinel";

interface AuthorizationResponse {
  event: SecurityEvent;
}

interface StatusResponse {
  status: "PENDING" | "RESOLVED";
  outcome?: "APPROVED" | "DENIED";
}

export interface CliActionOptions {
  apiBaseUrl: string;
  request: AuthorizationRequest;
  fetcher?: typeof fetch;
  pollIntervalMs?: number;
  maxPollAttempts?: number;
  onDecision?: (event: SecurityEvent) => void;
  onReview?: (event: SecurityEvent) => void;
  mockToolAdapter: (event: SecurityEvent) => Promise<void> | void;
}

const wait = (milliseconds: number) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function runMockCliAction(options: CliActionOptions): Promise<SecurityEvent> {
  const fetcher = options.fetcher || fetch;
  const baseUrl = options.apiBaseUrl.replace(/\/$/, "");
  const authorizationResponse = await fetcher(`${baseUrl}/authorize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(options.request),
  });
  const authorization = await authorizationResponse.json() as AuthorizationResponse & { error?: string };
  if (!authorizationResponse.ok || !authorization.event) {
    throw new Error(authorization.error || `Authorization failed (${authorizationResponse.status})`);
  }

  let event = authorization.event;
  options.onDecision?.(event);
  if (event.decision === "ALLOW") {
    await options.mockToolAdapter(event);
    return event;
  }
  if (event.decision === "BLOCK") return event;

  options.onReview?.(event);
  const intervalMs = options.pollIntervalMs ?? 500;
  const maxAttempts = options.maxPollAttempts ?? 120;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    await wait(intervalMs);
    const statusResponse = await fetcher(`${baseUrl}/events/${encodeURIComponent(event.id)}/status`);
    const status = await statusResponse.json() as StatusResponse & { error?: string };
    if (!statusResponse.ok) throw new Error(status.error || `Approval status failed (${statusResponse.status})`);
    if (status.status === "RESOLVED") {
      if (status.outcome === "APPROVED") {
        event = { ...event, decision: "ALLOW", status: "RESOLVED" };
        await options.mockToolAdapter(event);
      } else {
        event = { ...event, decision: "BLOCK", status: "RESOLVED" };
      }
      return event;
    }
  }
  throw new Error(`Approval timed out for event ${event.id}; mock tool was not invoked`);
}
