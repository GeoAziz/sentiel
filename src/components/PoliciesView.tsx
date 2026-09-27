import React, { useState } from 'react';
import { Policy, PolicyRule, Decision } from '../types/sentinel';
import { FileText, Plus, Check, AlertTriangle, X, Shield, Search, Sliders, ToggleLeft, ToggleRight } from 'lucide-react';
import { matchPattern } from '../utils/engine';

interface PoliciesViewProps {
  policies: Policy[];
  onUpdatePolicy: (updated: Policy) => void;
  onAddPolicy: (newPolicy: Policy) => void;
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({
  policies,
  onUpdatePolicy,
  onAddPolicy,
}) => {
  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id || '');
  const [testInput, setTestInput] = useState('src/auth.ts');
  const [showAddRuleModal, setShowAddRuleModal] = useState(false);
  const [newRulePattern, setNewRulePattern] = useState('');
  const [newRuleDecision, setNewRuleDecision] = useState<Decision>('BLOCK');
  const [newRuleGroup, setNewRuleGroup] = useState('Filesystem Access');
  const [newRuleExplanation, setNewRuleExplanation] = useState('');

  const activePolicy = policies.find((p) => p.id === selectedPolicyId) || policies[0];

  // Test evaluator
  const evaluatedRule = React.useMemo(() => {
    if (!activePolicy || !testInput) return null;
    for (const g of activePolicy.groups) {
      for (const r of g.rules) {
        if (r.enabled && matchPattern(r.res, testInput)) {
          return r;
        }
      }
    }
    return { res: '*', dec: 'BLOCK', explanation: 'Default-Deny fallback' };
  }, [activePolicy, testInput]);

  const handleToggleRule = (groupIdx: number, ruleId: string) => {
    if (!activePolicy) return;
    const updated = {
      ...activePolicy,
      groups: activePolicy.groups.map((group, gI) => {
        if (gI !== groupIdx) return group;
        return {
          ...group,
          rules: group.rules.map((rule) => {
            if (rule.id !== ruleId) return rule;
            return { ...rule, enabled: !rule.enabled };
          }),
        };
      }),
    };
    onUpdatePolicy(updated);
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRulePattern.trim() || !activePolicy) return;

    let groupFound = false;
    const newRule: PolicyRule = {
      id: `r_${Date.now().toString(36)}`,
      res: newRulePattern.trim(),
      dec: newRuleDecision,
      explanation: newRuleExplanation || 'Custom organizational guardrail',
      enabled: true,
    };

    const updatedGroups = activePolicy.groups.map((grp) => {
      if (grp.name.toLowerCase() === newRuleGroup.toLowerCase()) {
        groupFound = true;
        return { ...grp, rules: [...grp.rules, newRule] };
      }
      return grp;
    });

    if (!groupFound) {
      updatedGroups.push({
        name: newRuleGroup,
        rules: [newRule],
      });
    }

    onUpdatePolicy({
      ...activePolicy,
      groups: updatedGroups,
      updatedAt: new Date().toISOString(),
    });

    setShowAddRuleModal(false);
    setNewRulePattern('');
    setNewRuleExplanation('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E8EAED] flex items-center gap-2">
            Authorization Policies
          </h1>
          <p className="text-xs text-[#9AA3AD] mt-1 max-w-2xl">
            Declarative runtime guardrails evaluated on every intercepted request. Changes propagate immediately to all bound agents.
          </p>
        </div>

        <button
          onClick={() => setShowAddRuleModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#4A9EFF] hover:bg-[#62adff] text-[#04101F] text-xs font-semibold cursor-pointer transition-colors self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Policy Rule</span>
        </button>
      </div>

      {/* Policy Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E232A] pb-3 overflow-x-auto">
        {policies.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPolicyId(p.id)}
            className={`px-3 py-1.5 rounded-md text-xs mono font-medium transition-all shrink-0 cursor-pointer ${
              p.id === activePolicy.id
                ? 'bg-[#14171B] text-[#E8EAED] border border-[#2A3038] shadow-sm'
                : 'text-[#626B76] hover:text-[#9AA3AD]'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Policy Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg overflow-hidden">
            <div className="p-4 border-b border-[#1E232A] flex items-center justify-between bg-[#0A0C0E]">
              <div>
                <h2 className="text-sm font-bold text-[#E8EAED]">{activePolicy.name}</h2>
                <div className="text-[11px] text-[#626B76] mono mt-0.5">
                  Applies to: <span className="text-[#4A9EFF]">{activePolicy.appliesTo}</span>
                </div>
              </div>
              <span className="mono text-[10px] text-[#626B76]">
                Rule sets active
              </span>
            </div>

            <div className="divide-y divide-[#1E232A]">
              {activePolicy.groups.map((group, gIdx) => (
                <div key={group.name}>
                  <div className="p-2.5 px-4 bg-[#14171B] border-b border-[#1E232A] mono text-[11px] font-semibold tracking-wider uppercase text-[#9AA3AD]">
                    {group.name}
                  </div>
                  <div className="divide-y divide-[#1E232A]">
                    {group.rules.map((rule) => {
                      const toneCls =
                        rule.dec === 'ALLOW'
                          ? 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30'
                          : rule.dec === 'REVIEW'
                          ? 'bg-[#F5A524]/15 text-[#F5A524] border-[#F5A524]/30'
                          : 'bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30';

                      const glyph = rule.dec === 'ALLOW' ? '✓' : rule.dec === 'REVIEW' ? '⚠' : '✕';

                      return (
                        <div
                          key={rule.id}
                          className={`p-3 px-4 flex items-center justify-between gap-4 hover:bg-[#171B21] transition-colors ${
                            !rule.enabled ? 'opacity-40 line-through' : ''
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="mono text-xs font-semibold text-[#E8EAED] flex items-center gap-2">
                              <span>{rule.res}</span>
                              {rule.requireTrustedOrigin && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-[#FF4D4F]/10 border border-[#FF4D4F]/25 text-[#FF4D4F]">
                                  TAINT PROTECTED
                                </span>
                              )}
                            </div>
                            {rule.explanation && (
                              <div className="text-[11px] text-[#626B76] mt-0.5 leading-relaxed">
                                {rule.explanation}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            <span className={`mono text-[10px] px-2 py-0.5 rounded font-bold border ${toneCls}`}>
                              <span className="mr-1">{glyph}</span>
                              {rule.dec}
                            </span>

                            <button
                              onClick={() => handleToggleRule(gIdx, rule.id)}
                              className={`mono text-[10px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                                rule.enabled
                                  ? 'bg-[#14171B] border-[#2A3038] text-[#9AA3AD] hover:text-[#E8EAED]'
                                  : 'bg-[#FF4D4F]/10 border-[#FF4D4F]/30 text-[#FF4D4F]'
                              }`}
                              title={rule.enabled ? 'Click to disable rule' : 'Click to enable rule'}
                            >
                              {rule.enabled ? 'ENABLED' : 'DISABLED'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Pattern Match Tester (1 Col) */}
        <div className="space-y-4">
          <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#E8EAED] flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-[#4A9EFF]" />
              Policy Match Simulator
            </div>
            <p className="text-[11px] text-[#9AA3AD] leading-relaxed">
              Test how this policy evaluates arbitrary filepaths, shell commands, or capability strings.
            </p>

            <div>
              <label className="text-[10px] uppercase font-semibold text-[#626B76] block mb-1">
                Target Resource / Command
              </label>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="e.g. src/auth.ts or .env"
                className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs mono text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
              />
            </div>

            {/* Quick Test Presets */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'src/controllers/api.ts',
                'tests/unit.test.ts',
                '.env.production',
                '~/.ssh/id_rsa',
                'rm -rf node_modules',
                'git push origin main',
                'deploy production',
              ].map((preset) => (
                <button
                  key={preset}
                  onClick={() => setTestInput(preset)}
                  className="mono text-[10px] px-2 py-0.5 rounded bg-[#14171B] border border-[#1E232A] text-[#9AA3AD] hover:text-[#E8EAED] hover:border-[#2A3038] transition-colors cursor-pointer"
                >
                  {preset}
                </button>
              ))}
            </div>

            {/* Evaluated Verdict Box */}
            {evaluatedRule && (
              <div className="pt-3 border-t border-[#1E232A] space-y-2">
                <div className="text-[10px] uppercase font-semibold text-[#626B76]">
                  Evaluated Decision
                </div>
                <div className="p-3 rounded-md bg-[#14171B] border border-[#1E232A] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="mono text-xs font-semibold text-[#E8EAED]">
                      Matched: &ldquo;{evaluatedRule.res}&rdquo;
                    </span>
                    <span
                      className={`mono text-[10px] px-2 py-0.5 rounded font-bold border ${
                        evaluatedRule.dec === 'ALLOW'
                          ? 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30'
                          : evaluatedRule.dec === 'REVIEW'
                          ? 'bg-[#F5A524]/15 text-[#F5A524] border-[#F5A524]/30'
                          : 'bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30'
                      }`}
                    >
                      {evaluatedRule.dec}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#9AA3AD]">
                    {evaluatedRule.explanation}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Policy Rule Modal */}
      {showAddRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0E1013] border border-[#1E232A] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E232A]">
              <div className="text-sm font-bold text-[#E8EAED] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#4A9EFF]" />
                <span>Add Rule to {activePolicy.name}</span>
              </div>
              <button
                onClick={() => setShowAddRuleModal(false)}
                className="text-[#626B76] hover:text-[#E8EAED]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddRule} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#626B76] block mb-1">
                  Resource Pattern (Glob)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. api/v1/** or config/*.yaml"
                  value={newRulePattern}
                  onChange={(e) => setNewRulePattern(e.target.value)}
                  className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs mono text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#626B76] block mb-1">
                    Enforcement Decision
                  </label>
                  <select
                    value={newRuleDecision}
                    onChange={(e) => setNewRuleDecision(e.target.value as Decision)}
                    className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs mono text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
                  >
                    <option value="ALLOW">ALLOW</option>
                    <option value="REVIEW">REVIEW (Gated)</option>
                    <option value="BLOCK">BLOCK (Deny)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#626B76] block mb-1">
                    Rule Group
                  </label>
                  <select
                    value={newRuleGroup}
                    onChange={(e) => setNewRuleGroup(e.target.value)}
                    className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
                  >
                    <option value="Filesystem Access">Filesystem Access</option>
                    <option value="Command Execution">Command Execution</option>
                    <option value="Version Control (Git)">Version Control (Git)</option>
                    <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#626B76] block mb-1">
                  Audit Justification
                </label>
                <input
                  type="text"
                  placeholder="Why is this capability permitted, gated, or denied?"
                  value={newRuleExplanation}
                  onChange={(e) => setNewRuleExplanation(e.target.value)}
                  className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E232A]">
                <button
                  type="button"
                  onClick={() => setShowAddRuleModal(false)}
                  className="px-3 py-1.5 rounded text-xs text-[#9AA3AD] hover:bg-[#14171B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#4A9EFF] hover:bg-[#62adff] text-[#04101F] text-xs font-semibold"
                >
                  Add Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
