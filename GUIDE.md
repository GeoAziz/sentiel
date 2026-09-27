# Sentinel — Usage Guide

Sentinel is a mock runtime authorization firewall for AI agents. It simulates a
zero-trust policy layer that intercepts agent actions (`authorize` requests),
evaluates them against per-agent policies, and returns an `ALLOW` / `BLOCK` /
`REVIEW` decision — including a human-in-the-loop approval flow for actions
that need operator sign-off.

Everything in this build is mock-only (`mockOnly: true` on every response):
no real filesystem, shell, or deployment tool is ever invoked. It's meant for
demoing and testing the authorization/policy model itself.

The `ALLOW` / `REVIEW` / `BLOCK` decision is always produced by the
deterministic policy engine (`src/utils/engine.ts`) — never by AI. When a
request is ambiguous (no matching policy rule, or a pending human `REVIEW`)
and a real `GEMINI_API_KEY` is configured, Sentinel additionally calls Gemini
to produce contextual advisory analysis (intent, threat, risk, reasoning) for
the human reviewer. Gemini never sets or overrides the decision, and if it's
unconfigured or the call fails, Sentinel falls back to a deterministic
regex-based mock advisory and functions identically otherwise.

## 1. Prerequisites

- Node.js (with `npm`)
- Docker + Docker Compose (only needed if you want persistent Postgres storage
  — the app falls back to an in-memory store automatically if no database is
  configured)

## 2. Setup

```bash
npm install
cp .env.example .env
```

Edit `.env` if needed:

| Variable | Purpose |
|---|---|
| `PORT` | Port the Express server listens on (default `3000`) |
| `DATABASE_URL` | Postgres connection string. If unset/unreachable, Sentinel runs in in-memory mode. |
| `SENTINEL_API_URL` | Base URL the CLI (`cli.ts`) uses to reach the API |
| `GEMINI_API_KEY` | Optional. Enables real Gemini advisory analysis for ambiguous decisions. Leave as the placeholder to stay fully deterministic/mock. |

> If port `5432` is already used by another Postgres container on your
> machine, change the mapped port in `docker-compose.yml` (e.g. `"5436:5432"`)
> and update `DATABASE_URL` to match.

### Optional: start Postgres and run migrations

```bash
npm run db:up       # starts the postgres container (docker compose)
npm run db:migrate  # applies schema + seed data
# or both in one step:
npm run db:bootstrap
```

To stop the database: `npm run db:down`.

## 3. Running the app

```bash
npm run dev
```

This starts the Express server with Vite in middleware mode (hot reload
enabled). Visit:

```
http://localhost:3000
```

On startup the server logs which backend mode it's using:

```
Sentinel backend listening on http://0.0.0.0:3000
Backend mode: postgres   # or: memory
```

Check this at any time via:

```bash
curl http://localhost:3000/api/backend-status
```

### Production build

```bash
npm run build     # vite build -> dist/
NODE_ENV=production npm start
```

In production mode the server serves the built static files from `dist/`
instead of using Vite middleware.

## 4. Using the web console

The web UI (React app) lets you:

- View configured **agents** and their assigned **policies**
- Inspect policy rules grouped by category (filesystem, command execution,
  git, deployment, etc.), each with an `ALLOW` / `BLOCK` / `REVIEW` decision
- Watch a live **event stream** of authorization requests as they happen
- Resolve **pending approvals** (`REVIEW` decisions) by approving or denying
  them as a mock operator

## 5. Using the CLI demo

A scripted demo that fires three sample authorization requests against a
running Sentinel server and prints the decisions:

```bash
npm run sentinel run demo
```

It walks through:
1. An allowed source file read
2. A blocked read of a protected secret (`.env`)
3. A gated production deployment request (`REVIEW`)

The CLI talks to whatever `SENTINEL_API_URL` points at (default
`http://localhost:3000`), so the dev server must be running first.

## 6. HTTP API reference

All responses include `mockOnly: true`.

| Method | Path | Purpose |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/config` | List agents + policies |
| PUT | `/api/config` | Update agents/policies (body: `{ agents?, policies? }`) |
| POST | `/authorize` | Submit an authorization request (see below) |
| GET | `/events` | List all past authorization events |
| GET | `/events/stream` | Server-Sent Events stream of live events |
| POST | `/events/:id/approve` | Resolve a pending `REVIEW` event |
| GET | `/events/:id/status` | Get the status of a specific event |
| POST | `/api/demo/reset` | Reset runtime state back to seed data |
| GET | `/api/backend-status` | Check whether the server is using Postgres or in-memory storage |

### Submit an authorization request

```bash
curl -X POST http://localhost:3000/authorize \
  -H 'Content-Type: application/json' \
  -d '{
    "agent_id": "agent_coding_01",
    "capability": "filesystem.read",
    "resource": "tests/auth.test.ts",
    "action": "read tests/auth.test.ts",
    "context": { "source": "operator task", "trust": "TRUSTED" }
  }'
```

Required fields: `agent_id`, `capability`, `resource` (strings, within size
limits). Response includes `decision` (`ALLOW` | `BLOCK` | `REVIEW`), the
matched `policy`, and an `event_id` you can use to check status or resolve
approval.

### Resolve a pending review

```bash
curl -X POST http://localhost:3000/events/<event_id>/approve \
  -H 'Content-Type: application/json' \
  -d '{ "outcome": "APPROVED", "by": "operator@example.com", "reason": "Verified manually" }'
```

`outcome` must be `"APPROVED"` or `"DENIED"`; `by` is required.

## 7. Running tests

```bash
npm test
```

Runs the Node test runner over `tests/mockSentinel.test.ts`,
`tests/httpApi.test.ts`, `tests/cliRunner.test.ts`, `tests/engine.test.ts`,
`tests/geminiAdvisor.test.ts`, and `tests/databaseRuntime.test.ts`.

## 8. Useful scripts summary

| Script | Description |
|---|---|
| `npm run dev` / `npm start` | Run the server (dev: Vite middleware, prod: static `dist/`) |
| `npm run build` | Build the frontend for production |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm test` | Run the test suite |
| `npm run sentinel run demo` | Run the CLI demo against a live server |
| `npm run db:up` / `db:down` | Start/stop the Postgres container |
| `npm run db:migrate` | Apply schema migrations + seed data |
| `npm run db:bootstrap` | `db:up` + `db:migrate` in one step |
| `npm run db:studio` | Open Drizzle Studio to browse the database |
