import { Agent, Policy, Decision, SecurityEvent, TrustLevel, EventStatus } from '../types/sentinel';

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
  let matchedRule: { res: string; dec: Decision; explanation?: string; requireTrustedOrigin?: boolean } | null = null;

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
        { label: 'Mock action blocked; no real tool was invoked.', state: 'done', tone: 'block' },
      ],
    };
  }

  if (matchedRule?.requireTrustedOrigin && sourceTrust !== 'TRUSTED') {
    return {
      decision: 'BLOCK',
      status: 'PREVENTED',
      policyId: policy.id,
      policyName: policy.name,
      reason: matchedRule.explanation || `Rule "${matchedRule.res}" requires trusted provenance.`,
      timeline: [
        { label: `Agent requested ${capability}("${resource}")`, state: 'done' },
        { label: 'Sentinel checked request provenance', state: 'done' },
        { label: `Policy evaluated: ${matchedRule.res} requires trusted origin -> BLOCK`, state: 'done', tone: 'block' },
        { label: 'Mock tool adapter not invoked', state: 'done', tone: 'block' },
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
        { label: 'Mock adapter may proceed; no real tool is executed.', state: 'done', tone: 'allow' },
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
      { label: 'Mock adapter withheld by default-deny policy', state: 'done', tone: 'block' },
    ],
  };
}

// Generates an illustrative, non-cryptographic event fingerprint for the demo UI.
export function generateHash(prevHash: string, eventId: string, timestamp: string): string {
  const str = `${prevHash}_${eventId}_${timestamp}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `mock-${hex}`;
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
