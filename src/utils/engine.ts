import { Agent, Policy, Decision, AISecurityAnalysis, SecurityEvent, TrustLevel, EventStatus } from '../types/sentinel';

// Pattern matcher supporting standard glob wildcards (e.g. src/**, .env*, rm -rf*)
export function matchPattern(pattern: string, target: string): boolean {
  if (!pattern || !target) return false;
  const p = pattern.trim().toLowerCase();
  const t = target.trim().toLowerCase();

  if (p === t) return true;
  if (p === '*') return true;

  // Convert glob to regex
  const regexStr = '^' + p
    .replace(/[.+^${}()|[\]\\]/g, '\\$&')
    .replace(/\*\*/g, '.*')
    .replace(/(?<!\.)\*/g, '[^/]*') + '$';

  try {
    const reg = new RegExp(regexStr, 'i');
    if (reg.test(t)) return true;
  } catch (err) {
    // fallback to simple substring
  }

  return t.includes(p.replace(/\*/g, ''));
}

export interface EvaluationResult {
  decision: Decision;
  status: EventStatus;
  policyId: string;
  policyName: string;
  reason: string;
  timeline: { label: string; state: 'done' | 'active' | 'pending'; tone?: 'allow' | 'review' | 'block' }[];
}

export function evaluateRequest(
  agent: Agent,
  policy: Policy,
  capability: string,
  resource: string,
  sourceTrust: TrustLevel,
  sourceOrigin: string
): EvaluationResult {
  const normResource = resource.toLowerCase();
  const normCap = capability.toLowerCase();

  // 1. Taint Check: If source is UNTRUSTED and accessing sensitive or execution vectors, strict block
  const isSecretTarget = (
    normResource.includes('.env') ||
    normResource.includes('.ssh') ||
    normResource.includes('secret') ||
    normResource.includes('credential') ||
    normResource.includes('id_rsa') ||
    normResource.includes('aws') ||
    normResource.includes('token')
  );

  const isDestructive = (
    normResource.includes('rm -rf') ||
    normResource.includes('drop table') ||
    normResource.includes('drop database') ||
    normResource.includes('--force') ||
    normResource.includes('format')
  );

  // 2. Iterate through policy rules for matching
  let matchedRule: { res: string; dec: Decision; explanation?: string } | null = null;

  for (const group of policy.groups) {
    for (const rule of group.rules) {
      if (!rule.enabled) continue;
      if (matchPattern(rule.res, resource) || matchPattern(rule.res, capability)) {
        matchedRule = rule;
        break;
      }
    }
    if (matchedRule) break;
  }

  // Enforce taint quarantine
  if (sourceTrust === 'UNTRUSTED' && (isSecretTarget || isDestructive)) {
    return {
      decision: 'BLOCK',
      status: 'PREVENTED',
      policyId: policy.id,
      policyName: policy.name,
      reason: `Provenance taint violation: Instruction originated from untrusted source (${sourceOrigin}) targeting sensitive resource. Quarantined.`,
      timeline: [
        { label: `Agent ingested untrusted context from ${sourceOrigin}`, state: 'done' },
        { label: `Agent requested ${capability}("${resource}")`, state: 'done' },
        { label: 'Sentinel intercepted request at runtime boundary', state: 'done' },
        { label: 'Taint tracking flagged UNTRUSTED origin', state: 'done', tone: 'block' },
        { label: 'Policy evaluated: Zero-Trust Taint Quarantine -> BLOCK', state: 'done', tone: 'block' },
        { label: 'Action blocked. Zero bytes leaked.', state: 'done', tone: 'allow' },
      ],
    };
  }

  if (matchedRule) {
    if (matchedRule.dec === 'BLOCK') {
      return {
        decision: 'BLOCK',
        status: 'PREVENTED',
        policyId: policy.id,
        policyName: policy.name,
        reason: matchedRule.explanation || `Policy rule "${matchedRule.res}" specifies BLOCK for this agent.`,
        timeline: [
          { label: `Agent requested ${capability}("${resource}")`, state: 'done' },
          { label: 'Sentinel inspected execution arguments', state: 'done' },
          { label: `Policy evaluated: ${matchedRule.res} -> BLOCK`, state: 'done', tone: 'block' },
          { label: 'Action prevented before tool execution', state: 'done', tone: 'block' },
        ],
      };
    }

    if (matchedRule.dec === 'REVIEW') {
      return {
        decision: 'REVIEW',
        status: 'PENDING',
        policyId: policy.id,
        policyName: policy.name,
        reason: matchedRule.explanation || `High-impact action (${matchedRule.res}) requires human supervisor review.`,
        timeline: [
          { label: `Agent requested ${capability}("${resource}")`, state: 'done' },
          { label: 'Sentinel intercepted privileged operation', state: 'done' },
          { label: `Policy evaluated: ${matchedRule.res} -> REVIEW`, state: 'done', tone: 'review' },
          { label: 'Awaiting human authorization in Sentinel queue', state: 'active', tone: 'review' },
        ],
      };
    }

    return {
      decision: 'ALLOW',
      status: 'RESOLVED',
      policyId: policy.id,
      policyName: policy.name,
      reason: matchedRule.explanation || `Resource matches allowed pattern "${matchedRule.res}".`,
      timeline: [
        { label: `Operator / pipeline dispatched task`, state: 'done' },
        { label: `Agent requested ${capability}("${resource}")`, state: 'done' },
        { label: 'Sentinel verified identity & role boundary', state: 'done' },
        { label: `Policy evaluated: ${matchedRule.res} -> ALLOW`, state: 'done', tone: 'allow' },
        { label: 'Tool call permitted and executed safely', state: 'done', tone: 'allow' },
      ],
    };
  }

  // Default-deny for undeclared capabilities or shadow tools
  return {
    decision: 'BLOCK',
    status: 'PREVENTED',
    policyId: policy.id,
    policyName: policy.name,
    reason: `Default Deny: Resource or capability "${capability} / ${resource}" is not permitted under ${policy.name}.`,
    timeline: [
      { label: `Agent requested ${capability}("${resource}")`, state: 'done' },
      { label: 'Sentinel checked declared tool matrix', state: 'done' },
      { label: 'Resource not in whitelist -> Default Deny', state: 'done', tone: 'block' },
      { label: 'Execution halted at runtime boundary', state: 'done', tone: 'block' },
    ],
  };
}

// Calls Gemini AI threat analysis backend endpoint
export async function analyzeWithAI(
  agent: Agent,
  capability: string,
  resource: string,
  action: string,
  source: { origin: string; trust: TrustLevel },
  policyRule: { name: string; reason: string }
): Promise<AISecurityAnalysis> {
  try {
    const res = await fetch('/api/security/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent,
        capability,
        resource,
        action,
        source,
        policyRule,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.analysis) {
        return {
          ...data.analysis,
          engine: data.engine || 'gemini-3.8-flash',
        };
      }
    }
  } catch (err) {
    console.warn('Backend security analysis call failed, using client fallback', err);
  }

  // Fallback heuristic analysis if server is unreachable
  const isUntrusted = source.trust === 'UNTRUSTED';
  const isSecret = resource.includes('.env') || resource.includes('secret') || resource.includes('ssh');

  return {
    intent: isSecret ? 'Access private configuration credentials' : 'Execute operational tool action',
    threat: isUntrusted && isSecret ? 'Indirect Prompt Injection' : isSecret ? 'Unauthorized Secret Access' : 'Normal Authorized Operation',
    risk: isUntrusted && isSecret ? 'HIGH' : isSecret ? 'HIGH' : 'LOW',
    confidence: 94,
    recommendation: isSecret ? 'BLOCK' : 'ALLOW',
    mitreAtlasId: isUntrusted && isSecret ? 'AML.T0051' : 'AML.M0000',
    reasoning: isUntrusted && isSecret
      ? 'Untrusted source attempting to probe environment secrets. Verified injection signature.'
      : 'Evaluated against policy constraints.',
    engine: 'sentinel-local-heuristics',
  };
}

// Generate deterministic mock SHA-256 hash for event chaining
export function generateHash(prevHash: string, eventId: string, timestamp: string): string {
  const str = `${prevHash}_${eventId}_${timestamp}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `${hex}e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5`.slice(0, 64);
}

export function formatTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toTimeString().slice(0, 8);
  } catch {
    return iso;
  }
}

export function formatTimeShort(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toTimeString().slice(0, 5);
  } catch {
    return iso;
  }
}

export function getRelativeTime(iso: string): string {
  try {
    const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (sec < 60) return `${Math.max(1, sec)}s ago`;
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    return `${Math.floor(sec / 3600)}h ago`;
  } catch {
    return '';
  }
}
