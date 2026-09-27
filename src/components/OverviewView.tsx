import React from 'react';
import { Agent, SecurityEvent, Decision } from '../types/sentinel';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  CheckCircle, 
  XCircle, 
  Cpu, 
  ArrowRight, 
  Radio, 
  FileText, 
  ChevronRight,
  Sparkles,
  Layers,
  Database,
  Terminal,
  Shield
} from 'lucide-react';
import { formatTimeShort } from '../utils/engine';

interface OverviewViewProps {
  agents: Agent[];
  events: SecurityEvent[];
  onNavigate: (route: string, params?: Record<string, string>) => void;
  onSelectEvent: (id: string) => void;
  onSelectAgent: (id: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  agents,
  events,
  onNavigate,
  onSelectEvent,
  onSelectAgent,
}) => {
  const allowedCount = events.filter((e) => e.decision === 'ALLOW').length;
  const reviewCount = events.filter((e) => e.decision === 'REVIEW' && e.status === 'PENDING').length;
  const blockedCount = events.filter((e) => e.decision === 'BLOCK').length;
  const activeAgents = agents.filter((a) => a.status === 'ACTIVE').length;

  const recentEvents = events.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#E8EAED] flex items-center gap-2">
          Security Command Center
        </h1>
        <p className="text-sm text-[#9AA3AD] mt-1 max-w-2xl leading-relaxed">
          Zero-trust runtime authorization boundary. Every autonomous tool call, shell command, and filesystem descriptor is inspected before execution.
        </p>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold flex items-center justify-between">
            <span>Attached Agents</span>
            <Cpu className="w-3.5 h-3.5 text-[#4A9EFF]" />
          </div>
          <div className="mono text-2xl font-semibold text-[#E8EAED] mt-2">
            {activeAgents}
            <span className="text-[#626B76] text-sm font-normal">/{agents.length}</span>
          </div>
          <div className="text-[11px] text-[#626B76] mt-1 mono">Fleet active</div>
        </div>

        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold flex items-center justify-between">
            <span>Actions Inspected</span>
            <Radio className="w-3.5 h-3.5 text-[#9AA3AD]" />
          </div>
          <div className="mono text-2xl font-semibold text-[#E8EAED] mt-2">
            {events.length}
          </div>
          <div className="text-[11px] text-[#626B76] mt-1 mono">100% intercepted</div>
        </div>

        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold flex items-center justify-between">
            <span>Allowed</span>
            <CheckCircle className="w-3.5 h-3.5 text-[#2ED47A]" />
          </div>
          <div className="mono text-2xl font-semibold text-[#2ED47A] mt-2">
            {allowedCount}
          </div>
          <div className="text-[11px] text-[#626B76] mt-1 mono">Within authority</div>
        </div>

        <div 
          onClick={() => onNavigate('approvals')}
          className={`bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 relative overflow-hidden transition-all cursor-pointer ${
            reviewCount > 0 ? 'hover:border-[#F5A524]/50 hover:bg-[#14171B]' : ''
          }`}
        >
          <div className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold flex items-center justify-between">
            <span>Human Review</span>
            <Lock className="w-3.5 h-3.5 text-[#F5A524]" />
          </div>
          <div className="mono text-2xl font-semibold text-[#F5A524] mt-2 flex items-center gap-2">
            {reviewCount}
            {reviewCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#F5A524]/20 border border-[#F5A524]/40 font-normal">
                ACTION REQ
              </span>
            )}
          </div>
          <div className="text-[11px] text-[#626B76] mt-1 mono">High blast radius</div>
        </div>

        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold flex items-center justify-between">
            <span>Intrusions Blocked</span>
            <XCircle className="w-3.5 h-3.5 text-[#FF4D4F]" />
          </div>
          <div className="mono text-2xl font-semibold text-[#FF4D4F] mt-2">
            {blockedCount}
          </div>
          <div className="text-[11px] text-[#626B76] mt-1 mono">0 bytes leaked</div>
        </div>
      </div>

      {/* Enforcement Architecture Flowchart */}
      <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E8EAED] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#4A9EFF]" />
            Runtime Authorization Boundary
          </div>
          <span className="mono text-[11px] text-[#626B76]">
            Decoupled governance: model requests, Sentinel authorizes
          </span>
        </div>

        <div className="p-3 bg-[#08090B] border border-[#1E232A] rounded-md flex items-center justify-between gap-2 overflow-x-auto text-xs mono">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#14171B] border border-[#2A3038] text-[#9AA3AD] shrink-0">
            <Cpu className="w-3.5 h-3.5 text-[#9AA3AD]" />
            <span>AI Agent Fleet</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#3F464E] shrink-0" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#14171B] border border-[#4A9EFF]/30 text-[#4A9EFF] shrink-0">
            <Radio className="w-3.5 h-3.5 text-[#4A9EFF] animate-pulse" />
            <span>Sentinel Interceptor</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#3F464E] shrink-0" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#14171B] border border-[#2A3038] text-[#E8EAED] shrink-0">
            <FileText className="w-3.5 h-3.5 text-[#E8EAED]" />
            <span>Policy & Taint Engine</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#3F464E] shrink-0" />
          <div className="flex items-center gap-2 px-2 py-1 rounded bg-[#4A9EFF]/10 border border-[#4A9EFF]/20 text-[#4A9EFF] shrink-0 text-[11px]">
            <Sparkles className="w-3 h-3 text-[#4A9EFF]" />
            <span>Gemini Threat AI</span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#3F464E] shrink-0" />
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="px-2 py-1 rounded bg-[#2ED47A]/15 border border-[#2ED47A]/30 text-[#2ED47A] text-[11px] font-semibold">
              ALLOW
            </span>
            <span className="px-2 py-1 rounded bg-[#F5A524]/15 border border-[#F5A524]/30 text-[#F5A524] text-[11px] font-semibold">
              REVIEW
            </span>
            <span className="px-2 py-1 rounded bg-[#FF4D4F]/15 border border-[#FF4D4F]/30 text-[#FF4D4F] text-[11px] font-semibold">
              BLOCK
            </span>
          </div>
          <ArrowRight className="w-4 h-4 text-[#3F464E] shrink-0" />
          <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-[#14171B] border border-[#2A3038] text-[#9AA3AD] shrink-0">
            <Terminal className="w-3.5 h-3.5 text-[#9AA3AD]" />
            <span>Protected Tools</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Events & Agent Fleet */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events (2 columns) */}
        <div className="lg:col-span-2 bg-[#0E1013] border border-[#1E232A] rounded-lg flex flex-col">
          <div className="p-4 border-b border-[#1E232A] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-[#E8EAED]">
                Recent Intercepted Events
              </span>
              <span className="mono text-[11px] text-[#626B76]">
                ({events.length} total)
              </span>
            </div>
            <button
              onClick={() => onNavigate('events')}
              className="text-xs text-[#4A9EFF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#1E232A] flex-1">
            {recentEvents.map((evt) => {
              const toneCls =
                evt.decision === 'ALLOW'
                  ? 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30'
                  : evt.decision === 'REVIEW'
                  ? 'bg-[#F5A524]/15 text-[#F5A524] border-[#F5A524]/30'
                  : 'bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30';

              const glyph = evt.decision === 'ALLOW' ? '✓' : evt.decision === 'REVIEW' ? '⚠' : '✕';

              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt.id)}
                  className="p-3 px-4 hover:bg-[#171B21] transition-colors cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="mono text-xs text-[#626B76] w-12 shrink-0">
                      {formatTimeShort(evt.ts)}
                    </span>
                    <span className="mono text-xs text-[#9AA3AD] w-28 shrink-0 truncate">
                      {evt.agent.name}
                    </span>
                    <span className="mono text-xs text-[#E8EAED] truncate font-medium">
                      {evt.action}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {evt.source.trust === 'UNTRUSTED' && (
                      <span className="mono text-[10px] text-[#FF4D4F] px-1.5 py-0.5 rounded bg-[#FF4D4F]/10 border border-[#FF4D4F]/25">
                        UNTRUSTED TAINT
                      </span>
                    )}
                    <span className={`mono text-[10px] px-2 py-0.5 rounded font-semibold border ${toneCls}`}>
                      <span className="mr-1">{glyph}</span>
                      {evt.decision}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Attached Agents (1 column) */}
        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg flex flex-col">
          <div className="p-4 border-b border-[#1E232A] flex items-center justify-between">
            <span className="font-semibold text-sm text-[#E8EAED]">
              Attached Agent Fleet
            </span>
            <button
              onClick={() => onNavigate('agents')}
              className="text-xs text-[#4A9EFF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#1E232A] flex-1">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => onSelectAgent(agent.id)}
                className="p-3 px-4 hover:bg-[#171B21] transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        agent.status === 'ACTIVE'
                          ? 'bg-[#2ED47A] shadow-[0_0_6px_rgba(46,212,122,0.8)]'
                          : agent.status === 'QUARANTINED'
                          ? 'bg-[#FF4D4F]'
                          : 'bg-[#626B76]'
                      }`}
                    />
                    <span className="text-xs font-medium text-[#E8EAED] group-hover:text-[#4A9EFF] transition-colors">
                      {agent.name}
                    </span>
                  </div>
                  <div className="mono text-[11px] text-[#626B76] mt-0.5">
                    {agent.model} · {agent.environment}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`mono text-[10px] px-1.5 py-0.5 rounded border ${
                      agent.status === 'ACTIVE'
                        ? 'text-[#2ED47A] border-[#2ED47A]/30 bg-[#2ED47A]/10'
                        : agent.status === 'QUARANTINED'
                        ? 'text-[#FF4D4F] border-[#FF4D4F]/30 bg-[#FF4D4F]/10'
                        : 'text-[#626B76] border-[#2A3038]'
                    }`}
                  >
                    {agent.status}
                  </span>
                  <div className="text-[10px] text-[#626B76] mt-1 mono">
                    {agent.policyName}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
