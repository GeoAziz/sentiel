export type Decision = 'ALLOW' | 'REVIEW' | 'BLOCK';
export type EventStatus = 'RESOLVED' | 'PREVENTED' | 'PENDING' | 'OVERRIDDEN';
export type TrustLevel = 'TRUSTED' | 'UNTRUSTED';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AgentStatus = 'ACTIVE' | 'IDLE' | 'SUSPENDED' | 'QUARANTINED';

export interface AuthorizationRequest {
  agent_id: string;
  capability: string;
  resource: string;
  action?: string;
  context?: {
    source?: string;
    trust?: TrustLevel;
    promptSnippet?: string;
  };
}

export interface AgentCapability {
  label: string;
  state: 'yes' | 'no' | 'warn';
  toolName?: string;
}

export interface Agent {
  id: string;
  name: string;
  model: string;
  environment: 'Development' | 'Staging' | 'Production';
  status: AgentStatus;
  risk: 'Controlled' | 'Elevated' | 'Critical';
  policyId: string;
  policyName: string;
  capabilities: AgentCapability[];
  requestsCount: number;
  blockedCount: number;
  isolated?: boolean;
  avatarSeed?: string;
  description?: string;
}

export interface PolicyRule {
  id: string;
  res: string;
  dec: Decision;
  requireTrustedOrigin?: boolean;
  explanation?: string;
  enabled: boolean;
}

export interface PolicyGroup {
  name: string;
  rules: PolicyRule[];
}

export interface Policy {
  id: string;
  name: string;
  appliesTo: string;
  description?: string;
  groups: PolicyGroup[];
  updatedAt?: string;
}

export interface TimelineStep {
  label: string;
  state: 'done' | 'active' | 'pending';
  tone?: 'allow' | 'review' | 'block' | 'neutral';
  timestamp?: string;
}

export interface AISecurityAnalysis {
  intent: string;
  threat: string;
  risk: RiskLevel;
  confidence: number;
  recommendation: Decision;
  reasoning: string;
  mitreAtlasId?: string;
  engine?: string;
}

export interface SecurityEvent {
  id: string;
  ts: string;
  agent: {
    id: string;
    name: string;
    model: string;
  };
  capability: string;
  action: string;
  resource: string;
  decision: Decision;
  status: EventStatus;
  policy: {
    id: string;
    name: string;
    reason: string;
  };
  source: {
    origin: string;
    trust: TrustLevel;
    promptSnippet?: string;
  };
  timeline: TimelineStep[];
  dataExposed: number;
  analysis?: AISecurityAnalysis;
  approval?: {
    outcome: 'APPROVED' | 'DENIED';
    resolvedAt: string;
    operator: string;
    reason?: string;
  };
  hash: string;
}

export interface ToolItem {
  name: string;
  category: 'Filesystem' | 'Shell' | 'Git' | 'Deployment' | 'Database' | 'Network' | 'Secrets';
  description: string;
  riskWeight: 'Low' | 'Medium' | 'High' | 'Critical';
  defaultDecisions: Record<string, Decision>;
}

export interface AttackScenario {
  id: string;
  name: string;
  category: string;
  description: string;
  targetAgentId: string;
  capability: string;
  resource: string;
  action: string;
  sourceOrigin: string;
  sourceTrust: TrustLevel;
  promptSnippet: string;
  mitreCode: string;
  attackVector: string;
  steps: string[];
}
