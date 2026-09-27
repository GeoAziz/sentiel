import React, { useState } from 'react';
import { Agent, Policy } from '../types/sentinel';
import { Bot, Plus, Shield, AlertTriangle, ShieldCheck, ShieldAlert, Cpu, Lock, Power } from 'lucide-react';

interface AgentsViewProps {
  agents: Agent[];
  policies: Policy[];
  onSelectAgent: (id: string) => void;
  onToggleIsolateAgent: (id: string) => void;
  onAddAgent: (newAgent: Partial<Agent>) => void;
}

export const AgentsView: React.FC<AgentsViewProps> = ({
  agents,
  policies,
  onSelectAgent,
  onToggleIsolateAgent,
  onAddAgent,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentModel, setNewAgentModel] = useState('Claude 3.7 Sonnet');
  const [newAgentEnv, setNewAgentEnv] = useState<'Development' | 'Staging' | 'Production'>('Development');
  const [newAgentPolicyId, setNewAgentPolicyId] = useState(policies[0]?.id || '');
  const [newAgentDesc, setNewAgentDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const matchedPolicy = policies.find((p) => p.id === newAgentPolicyId) || policies[0];

    onAddAgent({
      id: `agent_${Date.now().toString(36)}`,
      name: newAgentName.trim(),
      model: newAgentModel,
      environment: newAgentEnv,
      status: 'ACTIVE',
      risk: 'Controlled',
      policyId: matchedPolicy?.id || 'pol_developer',
      policyName: matchedPolicy?.name || 'Developer Agent Policy',
      description: newAgentDesc || 'Custom enterprise autonomous agent instance',
      requestsCount: 0,
      blockedCount: 0,
      capabilities: [
        { label: 'Read workspace files', state: 'yes' },
        { label: 'Write workspace files', state: 'yes' },
        { label: 'Run local test suite', state: 'yes' },
        { label: 'Read secrets (.env)', state: 'no' },
        { label: 'Deploy to production', state: 'warn' },
      ],
    });

    setShowAddModal(false);
    setNewAgentName('');
    setNewAgentDesc('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E8EAED] flex items-center gap-2">
            AI Agent Fleet Directory
          </h1>
          <p className="text-xs text-[#9AA3AD] mt-1 max-w-2xl">
            Identity registry for autonomous AI agents. Security policies are bound to the agent identity, decoupled from the underlying model.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#4A9EFF] hover:bg-[#62adff] text-[#04101F] text-xs font-semibold cursor-pointer transition-colors shadow-sm shadow-[#4A9EFF]/20 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Register New Agent</span>
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((agent) => {
          const isQuarantined = agent.status === 'QUARANTINED' || agent.isolated;

          return (
            <div
              key={agent.id}
              className={`bg-[#0E1013] border rounded-lg p-5 flex flex-col justify-between transition-all duration-150 relative overflow-hidden group ${
                isQuarantined
                  ? 'border-[#FF4D4F]/40 bg-[#FF4D4F]/5'
                  : 'border-[#1E232A] hover:border-[#2A3038] hover:bg-[#14171B]'
              }`}
            >
              <div>
                {/* Agent Header */}
                <div className="flex items-center justify-between pb-3 border-b border-[#1E232A]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#14171B] border border-[#2A3038] flex items-center justify-center text-[#E8EAED]">
                      <Bot className="w-4 h-4 text-[#4A9EFF]" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#E8EAED] flex items-center gap-2">
                        <span>{agent.name}</span>
                        {isQuarantined && (
                          <span className="mono text-[10px] px-1.5 py-0.2 rounded bg-[#FF4D4F]/20 text-[#FF4D4F] border border-[#FF4D4F]/40 font-semibold">
                            ISOLATED
                          </span>
                        )}
                      </div>
                      <div className="mono text-[11px] text-[#626B76]">{agent.id}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`mono text-[10px] px-2 py-0.5 rounded font-semibold border ${
                        agent.status === 'ACTIVE'
                          ? 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30'
                          : agent.status === 'QUARANTINED'
                          ? 'bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30'
                          : 'bg-[#14171B] text-[#626B76] border-[#2A3038]'
                      }`}
                    >
                      {agent.status}
                    </span>
                  </div>
                </div>

                {/* Metadata Pills */}
                <div className="grid grid-cols-3 gap-2 py-3 text-[11px] mono border-b border-[#1E232A]">
                  <div>
                    <span className="text-[#626B76] text-[10px] block">MODEL</span>
                    <span className="text-[#E8EAED] font-medium">{agent.model}</span>
                  </div>
                  <div>
                    <span className="text-[#626B76] text-[10px] block">ENV</span>
                    <span className="text-[#E8EAED] font-medium">{agent.environment}</span>
                  </div>
                  <div>
                    <span className="text-[#626B76] text-[10px] block">RISK</span>
                    <span className="text-[#E8EAED] font-medium">{agent.risk}</span>
                  </div>
                </div>

                {/* Capabilities Checklist */}
                <div className="py-3 space-y-1.5">
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#626B76]">
                    Runtime Authority Boundary
                  </div>
                  <div className="space-y-1">
                    {agent.capabilities.map((c, i) => (
                      <div key={i} className="flex items-center justify-between text-xs mono">
                        <span className="text-[#9AA3AD]">{c.label}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                            c.state === 'yes'
                              ? 'text-[#2ED47A] bg-[#2ED47A]/10'
                              : c.state === 'no'
                              ? 'text-[#FF4D4F] bg-[#FF4D4F]/10'
                              : 'text-[#F5A524] bg-[#F5A524]/10'
                          }`}
                        >
                          {c.state === 'yes' ? 'ALLOW' : c.state === 'no' ? 'DENY' : 'REVIEW'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer Controls */}
              <div className="pt-3 border-t border-[#1E232A] flex items-center justify-between mt-2">
                <div className="mono text-[11px] text-[#626B76]">
                  Policy: <span className="text-[#4A9EFF]">{agent.policyName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleIsolateAgent(agent.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs mono font-semibold border transition-colors cursor-pointer ${
                      isQuarantined
                        ? 'bg-[#2ED47A]/15 border-[#2ED47A]/30 text-[#2ED47A] hover:bg-[#2ED47A]/25'
                        : 'bg-[#FF4D4F]/10 border-[#FF4D4F]/30 text-[#FF4D4F] hover:bg-[#FF4D4F]/20'
                    }`}
                    title={isQuarantined ? 'Re-attach agent to network' : 'Emergency kill switch: isolate agent from all tools'}
                  >
                    <Power className="w-3 h-3" />
                    <span>{isQuarantined ? 'RESTORE' : 'ISOLATE'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Register Agent Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0E1013] border border-[#1E232A] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1E232A]">
              <div className="flex items-center gap-2 text-[#E8EAED] font-bold text-sm">
                <Bot className="w-4 h-4 text-[#4A9EFF]" />
                <span>Register Autonomous Agent Identity</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#626B76] hover:text-[#E8EAED]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="text-[10px] uppercase font-semibold text-[#626B76] block mb-1">
                  Agent Display Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SRE Auto-Remediator"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#626B76] block mb-1">
                    Foundation Model
                  </label>
                  <select
                    value={newAgentModel}
                    onChange={(e) => setNewAgentModel(e.target.value)}
                    className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
                  >
                    <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet</option>
                    <option value="Gemini 2.5 Flash">Gemini 2.5 Flash</option>
                    <option value="GPT-4o">GPT-4o</option>
                    <option value="Llama 3 70B">Llama 3 70B</option>
                    <option value="DeepSeek R1">DeepSeek R1</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-semibold text-[#626B76] block mb-1">
                    Target Environment
                  </label>
                  <select
                    value={newAgentEnv}
                    onChange={(e) => setNewAgentEnv(e.target.value as any)}
                    className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
                  >
                    <option value="Development">Development</option>
                    <option value="Staging">Staging</option>
                    <option value="Production">Production</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#626B76] block mb-1">
                  Enforced Policy
                </label>
                <select
                  value={newAgentPolicyId}
                  onChange={(e) => setNewAgentPolicyId(e.target.value)}
                  className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
                >
                  {policies.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-semibold text-[#626B76] block mb-1">
                  Description / Purpose
                </label>
                <input
                  type="text"
                  placeholder="Operational responsibilities and scope"
                  value={newAgentDesc}
                  onChange={(e) => setNewAgentDesc(e.target.value)}
                  className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1E232A]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded text-xs text-[#9AA3AD] hover:bg-[#14171B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#4A9EFF] hover:bg-[#62adff] text-[#04101F] text-xs font-semibold"
                >
                  Register Agent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
