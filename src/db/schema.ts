import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const decisionEnum = pgEnum("decision", ["ALLOW", "REVIEW", "BLOCK"]);
export const eventStatusEnum = pgEnum("event_status", [
  "RESOLVED",
  "PREVENTED",
  "PENDING",
  "OVERRIDDEN",
]);
export const trustEnum = pgEnum("trust_level", ["TRUSTED", "UNTRUSTED"]);
export const riskEnum = pgEnum("risk_level", ["LOW", "MEDIUM", "HIGH", "CRITICAL"]);
export const agentStatusEnum = pgEnum("agent_status", [
  "ACTIVE",
  "IDLE",
  "SUSPENDED",
  "QUARANTINED",
]);

export const workspaces = pgTable("workspaces", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: varchar("slug", { length: 128 }).notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull().default("operator"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const agents = pgTable("agents", {
  id: text("id").primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  model: text("model").notNull(),
  environment: text("environment").notNull(),
  status: agentStatusEnum("status").notNull(),
  risk: text("risk").notNull(),
  policyId: text("policy_id").notNull(),
  policyName: text("policy_name").notNull(),
  description: text("description"),
  requestsCount: integer("requests_count").notNull().default(0),
  blockedCount: integer("blocked_count").notNull().default(0),
  isolated: boolean("isolated").notNull().default(false),
  avatarSeed: text("avatar_seed"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const agentCapabilities = pgTable("agent_capabilities", {
  id: uuid("id").primaryKey().defaultRandom(),
  agentId: text("agent_id").references(() => agents.id, { onDelete: "cascade" }).notNull(),
  label: text("label").notNull(),
  state: text("state").notNull(),
  toolName: text("tool_name"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const policyVersions = pgTable("policy_versions", {
  id: text("id").primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }),
  policyId: text("policy_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  appliesTo: text("applies_to").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  isActive: boolean("is_active").notNull().default(true),
});

export const policyRules = pgTable("policy_rules", {
  id: text("id").primaryKey(),
  policyVersionId: text("policy_version_id").references(() => policyVersions.id, { onDelete: "cascade" }).notNull(),
  groupName: text("group_name").notNull(),
  resourcePattern: text("resource_pattern").notNull(),
  decision: decisionEnum("decision").notNull(),
  requireTrustedOrigin: boolean("require_trusted_origin").notNull().default(false),
  explanation: text("explanation"),
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const securityEvents = pgTable("security_events", {
  id: text("id").primaryKey(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }),
  agentId: text("agent_id").references(() => agents.id, { onDelete: "set null" }),
  capability: text("capability").notNull(),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  decision: decisionEnum("decision").notNull(),
  status: eventStatusEnum("status").notNull(),
  policyId: text("policy_id").notNull(),
  policyName: text("policy_name").notNull(),
  policyReason: text("policy_reason").notNull(),
  sourceOrigin: text("source_origin").notNull(),
  sourceTrust: trustEnum("source_trust").notNull(),
  promptSnippet: text("prompt_snippet"),
  timeline: jsonb("timeline").notNull().default([]),
  dataExposed: integer("data_exposed").notNull().default(0),
  analysis: jsonb("analysis"),
  hash: text("hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const approvals = pgTable("approvals", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: text("event_id").references(() => securityEvents.id, { onDelete: "cascade" }).notNull(),
  outcome: text("outcome").notNull(),
  operator: text("operator").notNull(),
  reason: text("reason"),
  resolvedAt: timestamp("resolved_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspaceId: uuid("workspace_id").references(() => workspaces.id, { onDelete: "cascade" }),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  target: text("target"),
  metadata: jsonb("metadata").notNull().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
