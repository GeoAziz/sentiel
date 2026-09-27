import React from "react";
import { Agent, SecurityEvent, Decision } from "../types/sentinel";
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
  Shield,
} from "lucide-react";
import { formatTimeShort } from "../utils/engine";

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
  const allowedCount = events.filter((e) => e.decision === "ALLOW").length;
  const reviewCount = events.filter(
    (e) => e.decision === "REVIEW" && e.status === "PENDING",
  ).length;
  const blockedCount = events.filter((e) => e.decision === "BLOCK").length;
  const activeAgents = agents.filter((a) => a.status === "ACTIVE").length;

  const recentEvents = events.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#E8EAED] flex items-center gap-2">
          Security Command Center
        </h1>
        <p className="text-sm text-[#9AA3AD] mt-1 max-w-2xl leading-relaxed">
          Zero-trust runtime authorization boundary. Every autonomous tool call,
          shell command, and filesystem descriptor is inspected before
          execution.
        </p>
      </div>

      {/* Team Vision & Philosophy Callout Banner */}
      <div className="bg-gradient-to-r from-[#14172B] via-[#0E101D] to-[#0E1013] border border-[#5B45FF]/30 rounded-xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-[#5B45FF]/5 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2 text-[10px] mono text-[#A78BFA] font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#5B45FF] animate-pulse" />
            <span>The Sentinel Security Philosophy</span>
          </div>
          <p className="text-sm sm:text-base font-semibold text-white tracking-wide">
            &ldquo;We&apos;re not trying to make AI agents perfect. We&apos;re
            making sure an imperfect AI agent doesn&apos;t have unlimited
            authority.&rdquo;
          </p>
          <p className="text-xs text-[#9AA3AD]">
            Assume the AI can make a bad decision from poisoned context.
            Sentinel ensures that decision never exceeds its defined role
            boundary.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 z-10">
          <span className="mono text-xs px-3 py-1.5 rounded-lg bg-[#2ED47A]/15 border border-[#2ED47A]/30 text-[#2ED47A] font-semibold flex items-center gap-1.5 shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" /> Mock data only
          </span>
        </div>
      </div>

      {/* Top 5 Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold flex items-center justify-between">
            <span>Configured Agents</span>
            <Cpu className="w-3.5 h-3.5 text-[#4A9EFF]" />
          </div>
          <div className="mono text-2xl font-semibold text-[#E8EAED] mt-2">
            {activeAgents}
            <span className="text-[#626B76] text-sm font-normal">
              /{agents.length}
            </span>
          </div>
          <div className="text-[11px] text-[#626B76] mt-1 mono">
            Fleet active
          </div>
        </div>

        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold flex items-center justify-between">
            <span>Actions Inspected</span>
            <Radio className="w-3.5 h-3.5 text-[#9AA3AD]" />
          </div>
          <div className="mono text-2xl font-semibold text-[#E8EAED] mt-2">
            {events.length}
          </div>
          <div className="text-[11px] text-[#626B76] mt-1 mono">
            Requests evaluated by mock API
          </div>
        </div>

        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold flex items-center justify-between">
            <span>Allowed</span>
            <CheckCircle className="w-3.5 h-3.5 text-[#2ED47A]" />
          </div>
          <div className="mono text-2xl font-semibold text-[#2ED47A] mt-2">
            {allowedCount}
          </div>
          <div className="text-[11px] text-[#626B76] mt-1 mono">
            Within authority
          </div>
        </div>

        <div
          onClick={() => onNavigate("approvals")}
          className={`bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 relative overflow-hidden transition-all cursor-pointer ${
            reviewCount > 0
              ? "hover:border-[#F5A524]/50 hover:bg-[#14171B]"
              : ""
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
          <div className="text-[11px] text-[#626B76] mt-1 mono">
            High blast radius
          </div>
        </div>

        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 relative overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold flex items-center justify-between">
            <span>Intrusions Blocked</span>
            <XCircle className="w-3.5 h-3.5 text-[#FF4D4F]" />
          </div>
          <div className="mono text-2xl font-semibold text-[#FF4D4F] mt-2">
            {blockedCount}
          </div>
          <div className="text-[11px] text-[#626B76] mt-1 mono">
            No real data is accessed in mock mode
          </div>
        </div>
      </div>

      {/* Architecture & Paradigm Shift Visual Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Vulnerable (Without Sentinel) */}
        <div className="bg-[#0E1013] border border-[#FF4D4F]/25 rounded-lg p-4 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FF4D4F] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#FF4D4F]" />
              WITHOUT SENTINEL (VULNERABLE)
            </span>
            <span className="mono text-[10px] text-[#626B76]">
              Unrestricted Tool Authority
            </span>
          </div>

          <div className="p-3 bg-[#08090B] border border-[#1E232A] rounded-md font-mono text-[11px] space-y-1.5">
            <div className="flex items-center gap-2 text-[#9AA3AD]">
              <span>Developer / Prompt</span>
              <ArrowRight className="w-3 h-3 text-[#3F464E]" />
              <span className="text-[#E8EAED]">Claude Code</span>
              <ArrowRight className="w-3 h-3 text-[#FF4D4F]" />
              <span className="text-[#FF4D4F] font-bold">
                Unchecked Host Shell &amp; Files
              </span>
            </div>
            <div className="text-[#FF4D4F] text-[10px] pt-1">
              💥 Untrusted README injection commands agent to read .env
              $\rightarrow$ <strong>Secrets Exfiltrated!</strong>
            </div>
            <div className="text-[#FF4D4F] text-[10px]">
              💥 Hallucinated script commands <code>rm -rf /</code>{" "}
              $\rightarrow$ <strong>Filesystem Destroyed!</strong>
            </div>
          </div>
        </div>

        {/* Mock boundary illustration */}
        <div className="bg-[#0E1013] border border-[#2ED47A]/30 rounded-lg p-4 space-y-3 relative overflow-hidden shadow-sm shadow-[#2ED47A]/5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2ED47A] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#2ED47A] shadow-[0_0_6px_#2ED47A]" />
              WITH SENTINEL (ZERO-TRUST GOVERNANCE)
            </span>
            <span className="mono text-[10px] text-[#2ED47A]">
              Decoupled Authorization Proxy
            </span>
          </div>

          <div className="p-3 bg-[#08090B] border border-[#1E232A] rounded-md font-mono text-[11px] space-y-1.5">
            <div className="flex items-center gap-2 text-[#9AA3AD] overflow-x-auto">
              <span>Developer</span>
              <ArrowRight className="w-3 h-3 text-[#3F464E]" />
              <span>Claude Code</span>
              <ArrowRight className="w-3 h-3 text-[#4A9EFF]" />
              <span className="text-[#4A9EFF] font-bold px-1.5 py-0.5 rounded bg-[#4A9EFF]/15 border border-[#4A9EFF]/30">
                🛡️ SENTINEL
              </span>
              <ArrowRight className="w-3 h-3 text-[#3F464E]" />
              <span>Target Systems</span>
            </div>
            <div className="text-[#2ED47A] text-[10px] pt-1">
              ✓ Normal edits to <code>src/**</code> $\rightarrow${" "}
              <span className="font-bold">ALLOW ✅</span>
            </div>
            <div className="text-[#FF4D4F] text-[10px]">
              ✕ Secret probe to <code>.env</code> $\rightarrow${" "}
              <span className="font-bold">HARD BLOCK 🛑 (0B Leaked)</span>
            </div>
            <div className="text-[#F5A524] text-[10px]">
              ⚠ High blast-radius <code>deploy production</code> $\rightarrow${" "}
              <span className="font-bold">HUMAN REVIEW ⚠️</span>
            </div>
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
              onClick={() => onNavigate("events")}
              className="text-xs text-[#4A9EFF] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#1E232A] flex-1">
            {recentEvents.map((evt) => {
              const toneCls =
                evt.decision === "ALLOW"
                  ? "bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30"
                  : evt.decision === "REVIEW"
                    ? "bg-[#F5A524]/15 text-[#F5A524] border-[#F5A524]/30"
                    : "bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30";

              const glyph =
                evt.decision === "ALLOW"
                  ? "✓"
                  : evt.decision === "REVIEW"
                    ? "⚠"
                    : "✕";

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
                    {evt.source.trust === "UNTRUSTED" && (
                      <span className="mono text-[10px] text-[#FF4D4F] px-1.5 py-0.5 rounded bg-[#FF4D4F]/10 border border-[#FF4D4F]/25">
                        UNTRUSTED TAINT
                      </span>
                    )}
                    <span
                      className={`mono text-[10px] px-2 py-0.5 rounded font-semibold border ${toneCls}`}
                    >
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
              onClick={() => onNavigate("agents")}
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
                        agent.status === "ACTIVE"
                          ? "bg-[#2ED47A] shadow-[0_0_6px_rgba(46,212,122,0.8)]"
                          : agent.status === "QUARANTINED"
                            ? "bg-[#FF4D4F]"
                            : "bg-[#626B76]"
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
                      agent.status === "ACTIVE"
                        ? "text-[#2ED47A] border-[#2ED47A]/30 bg-[#2ED47A]/10"
                        : agent.status === "QUARANTINED"
                          ? "text-[#FF4D4F] border-[#FF4D4F]/30 bg-[#FF4D4F]/10"
                          : "text-[#626B76] border-[#2A3038]"
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
