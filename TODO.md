# Sentinel Mock Runtime Backlog

## Scope

Build the complete Sentinel demo flow with deterministic, local mock behavior. The mock API is the source of truth for authorization decisions and event state. No real agent is spawned, no real tool is executed, and no host files or secrets are accessed. Clearly label mocked enforcement and audit guarantees in the UI and CLI.

## Phase 1: Mock API boundary

- [ ] Define shared request, decision, event, and approval contracts for the CLI, API, and web app.
- [ ] Add `POST /authorize` with input validation and deterministic mock identity lookup.
- [ ] Move final policy evaluation behind the API; return only `ALLOW`, `REVIEW`, or `BLOCK` with a reason, policy, event ID, and optional advisory analysis.
- [ ] Keep advisory analysis separate from the authoritative policy decision; provide a deterministic mock analyzer with no external model calls.
- [ ] Add `GET /events/stream` SSE, including connect/reconnect behavior and delivery of newly recorded events.
- [ ] Add approval resolution and status endpoints: `POST /events/:id/approve` and `GET /events/:id/status`.
- [ ] Return safe errors for malformed requests, unknown agents/events, and invalid approval transitions.

**Acceptance:** API-level checks show policy determines the outcome regardless of advisory analysis; every valid authorization creates one event; REVIEW remains pending until resolved.

## Phase 2: Mock event store and policy enforcement

- [ ] Create one server-owned in-memory event store with append-only decision records and explicit approval-resolution records.
- [ ] Ensure authorization and approval endpoints, SSE, and audit export all read from the same store.
- [ ] Add deterministic IDs/timestamps where useful for repeatable demo tests; do not label a mock hash as cryptographic or tamper-proof.
- [ ] Implement deterministic policy fixtures covering an allowed source read, a REVIEW action, a blocked `.env` read, an unknown capability, and untrusted-origin context.
- [ ] Enforce default-deny for undeclared mock capabilities and deny execution for both BLOCK and unresolved REVIEW.
- [ ] Add focused tests for policy outcomes, append-only behavior, duplicate/invalid approval handling, and event streaming.

**Acceptance:** A BLOCK event cannot transition to ALLOW; a pending REVIEW cannot proceed; resolution adds a record without rewriting the original decision.

## Phase 3: Mock CLI interception demo

- [ ] Implement `sentinel run demo` in `cli.ts` as a scripted mock agent/tool-call harness; do not spawn an external model or shell command.
- [ ] Route each scripted tool request to `POST /authorize` before calling the mock tool adapter.
- [ ] Let the adapter return canned output only for ALLOW; never invoke it for BLOCK or pending REVIEW.
- [ ] For REVIEW, poll event status until approved/denied or a bounded timeout; proceed only on approval.
- [ ] Render decision, policy reason, event ID, and advisory-only label in terminal output.
- [ ] Add CLI tests proving blocked and pending actions produce no mock tool invocation.

**Acceptance:** The demo visibly allows safe reads, blocks `.env` with zero mock-tool calls, and demonstrates the approval round trip without touching the host environment.

## Phase 4: Connect the web control plane

- [ ] Replace the front end's random background event generator with events from the mock API SSE stream.
- [ ] Send sandbox and attack-simulator requests through `POST /authorize` instead of independently deciding outcomes in the browser.
- [ ] Connect the approval UI to the API resolution endpoint and reflect the resulting status/event update.
- [ ] Use API-backed events for live activity, overview metrics, event detail, and audit views; remove localStorage as the source of authoritative event state.
- [ ] Keep localStorage persistence for editable demo configuration only if needed, and indicate when the API is disconnected.
- [ ] Show a persistent mock-mode indicator; remove claims such as immutable ledger, active enforcement, or real agent protection unless explicitly qualified as simulated.
- [ ] Add an end-to-end demo check covering CLI request -> API decision -> SSE event -> web approval -> CLI status.

**Acceptance:** CLI and web show the same event ID and decision; a web approval updates the waiting CLI demo; API disconnect is visibly reported rather than replaced with fabricated live events.

## Phase 5: Demo polish and documentation

- [ ] Align the landing page and demo narration with the implemented mock flow and its limits.
- [ ] Ensure demo reset clears server mock state and browser demo configuration consistently.
- [ ] Document setup, demo commands, mock endpoints, and the non-production limitations.
- [ ] Run typecheck, production build, API/CLI tests, and the end-to-end mock demo; record any remaining gaps.

## Explicitly out of scope for mock phase

- Real Claude/Gemini/custom-agent spawning or SDK integrations.
- Executing filesystem, shell, network, deployment, or database tools.
- Real secrets, credentials, or production resources.
- Persistent or cryptographically tamper-evident event storage.
- Production authentication, authorization of operators, multi-tenancy, or deployment hardening.

## Suggested build order

1. API contracts, mock policy engine, and in-memory event store.
2. Authorization, SSE, approval, and status endpoints with tests.
3. Scripted CLI interceptor and blocked-call proof.
4. Web integration with the API and approval round trip.
5. Demo messaging, documentation, and full verification.
