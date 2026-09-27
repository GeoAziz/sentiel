import { INITIAL_AGENTS, INITIAL_POLICIES } from "../data/initialData";
import { getDbClient } from "./connection";
import {
  agents,
  agentCapabilities,
  policyVersions,
  policyRules,
  workspaces,
} from "./schema";

export async function seedDatabase() {
  const db = await getDbClient();
  if (!db) return false;

  const [workspace] = await db
    .insert(workspaces)
    .values({
      id: "00000000-0000-0000-0000-000000000001",
      name: "Sentinel Demo Workspace",
      slug: "sentinel-demo",
    })
    .onConflictDoNothing()
    .returning();

  const defaultWorkspace = workspace ?? {
    id: "00000000-0000-0000-0000-000000000001",
  };

  for (const agent of INITIAL_AGENTS) {
    await db
      .insert(agents)
      .values({
        id: agent.id,
        workspaceId: defaultWorkspace.id,
        name: agent.name,
        model: agent.model,
        environment: agent.environment,
        status: agent.status,
        risk: agent.risk,
        policyId: agent.policyId,
        policyName: agent.policyName,
        description: agent.description ?? null,
        requestsCount: agent.requestsCount,
        blockedCount: agent.blockedCount,
        isolated: Boolean(agent.isolated),
        avatarSeed: agent.avatarSeed ?? null,
      })
      .onConflictDoNothing();

    for (const capability of agent.capabilities) {
      await db
        .insert(agentCapabilities)
        .values({
          agentId: agent.id,
          label: capability.label,
          state: capability.state,
          toolName: capability.toolName ?? null,
        })
        .onConflictDoNothing();
    }
  }

  for (const policy of INITIAL_POLICIES) {
    const policyVersionId = `${policy.id}-v1`;

    await db
      .insert(policyVersions)
      .values({
        id: policyVersionId,
        workspaceId: defaultWorkspace.id,
        policyId: policy.id,
        name: policy.name,
        description: policy.description ?? null,
        appliesTo: policy.appliesTo,
        updatedAt: new Date(policy.updatedAt ?? Date.now()),
      })
      .onConflictDoNothing();

    for (const group of policy.groups) {
      for (const rule of group.rules) {
        await db
          .insert(policyRules)
          .values({
            id: rule.id,
            policyVersionId,
            groupName: group.name,
            resourcePattern: rule.res,
            decision: rule.dec,
            requireTrustedOrigin: Boolean(rule.requireTrustedOrigin),
            explanation: rule.explanation ?? null,
            enabled: rule.enabled,
          })
          .onConflictDoNothing();
      }
    }
  }

  return true;
}
