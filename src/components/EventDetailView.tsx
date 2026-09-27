import React from "react";
import { SecurityEvent } from "../types/sentinel";
import {
  ArrowLeft,
  Sparkles,
  ShieldAlert,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lock,
  Hash,
  FileCode,
  Shield,
  Clock,
} from "lucide-react";
import { formatTime } from "../utils/engine";

interface EventDetailViewProps {
  event: SecurityEvent;
  onBack: () => void;
  onResolveApproval: (id: string, outcome: "APPROVED" | "DENIED") => void;
}

export const EventDetailView: React.FC<EventDetailViewProps> = ({
  event,
  onBack,
  onResolveApproval,
}) => {
  const toneCls =
    event.decision === "ALLOW"
      ? "bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30"
      : event.decision === "REVIEW"
        ? "bg-[#F5A524]/15 text-[#F5A524] border-[#F5A524]/30"
        : "bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30";

  const glyph =
    event.decision === "ALLOW" ? "✓" : event.decision === "REVIEW" ? "⚠" : "✕";

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Navigation & Status */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs mono text-[#626B76] hover:text-[#E8EAED] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to events</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="mono text-xs text-[#626B76]">Event {event.id}</span>
          <span className="text-[#3F464E]">·</span>
          <span className="mono text-xs text-[#626B76]">
            {formatTime(event.ts)}
          </span>
        </div>
      </div>

      {/* Main Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-[#0E1013] border border-[#1E232A] rounded-lg">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`mono text-xs px-2.5 py-0.5 rounded font-bold border ${toneCls}`}
            >
              <span className="mr-1">{glyph}</span>
              {event.decision}
            </span>
            <span className="mono text-xs text-[#9AA3AD]">{event.status}</span>
          </div>
          <h1 className="text-lg font-bold text-[#E8EAED]">
            {event.agent.name}{" "}
            <span className="text-[#626B76] font-normal">attempted</span>{" "}
            <span className="mono text-[#4A9EFF]">{event.capability}</span>
          </h1>
        </div>

        {event.status === "PENDING" && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onResolveApproval(event.id, "DENIED")}
              className="px-3 py-1.5 rounded bg-[#FF4D4F]/15 hover:bg-[#FF4D4F]/25 border border-[#FF4D4F]/35 text-[#FF4D4F] text-xs font-semibold mono cursor-pointer transition-colors"
            >
              DENY ACTION
            </button>
            <button
              onClick={() => onResolveApproval(event.id, "APPROVED")}
              className="px-4 py-1.5 rounded bg-[#4A9EFF] hover:bg-[#62adff] text-[#04101F] text-xs font-semibold mono cursor-pointer transition-colors"
            >
              APPROVE ACTION
            </button>
          </div>
        )}
      </div>

      {/* 2-Column Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: 5Ws Authorization Record & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* 5Ws Authorization Record */}
          <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg overflow-hidden">
            <div className="p-3.5 px-4 border-b border-[#1E232A] bg-[#0A0C0E] flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#E8EAED]">
                5Ws Authorization Record
              </span>
              <span className="mono text-[11px] text-[#626B76]">
                Identity & Provenance Validation
              </span>
            </div>

            <div className="divide-y divide-[#1E232A] p-4 py-1">
              <div className="grid grid-cols-[100px_1fr] gap-4 py-3 items-baseline">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#626B76]">
                  WHO
                </span>
                <div className="mono text-xs">
                  <div className="text-[#E8EAED] font-semibold">
                    {event.agent.name}
                  </div>
                  <div className="text-[#626B76] text-[11px] mt-0.5">
                    {event.agent.id} · Model: {event.agent.model}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-4 py-3 items-baseline">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#626B76]">
                  WHAT
                </span>
                <div className="mono text-xs text-[#4A9EFF] font-semibold">
                  {event.capability}
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-4 py-3 items-baseline">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#626B76]">
                  ON WHAT
                </span>
                <div className="mono text-xs text-[#E8EAED] break-all bg-[#14171B] p-2 rounded border border-[#1E232A]">
                  {event.resource}
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-4 py-3 items-baseline">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#626B76]">
                  WHY
                </span>
                <div>
                  <div className="text-xs text-[#E8EAED] leading-relaxed">
                    {event.source.origin}
                  </div>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`inline-block px-2 py-0.5 rounded mono text-[10px] font-semibold border ${
                        event.source.trust === "UNTRUSTED"
                          ? "bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30"
                          : "bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30"
                      }`}
                    >
                      {event.source.trust} ORIGIN
                    </span>
                    {event.source.promptSnippet && (
                      <span className="text-[10px] text-[#626B76] truncate max-w-xs mono">
                        Snippet: &ldquo;{event.source.promptSnippet}&rdquo;
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-[100px_1fr] gap-4 py-3 items-baseline">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#626B76]">
                  DECISION
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`mono text-xs px-2.5 py-0.5 rounded font-bold border ${toneCls}`}
                    >
                      {event.decision}
                    </span>
                    <span className="mono text-[10px] px-2 py-0.5 rounded bg-[#2ED47A]/10 text-[#2ED47A] border border-[#2ED47A]/30 font-semibold tracking-wider uppercase">
                      AUTHORITATIVE · POLICY ENGINE
                    </span>
                    <span className="text-xs text-[#626B76] mono">
                      Policy: {event.policy.name}
                    </span>
                  </div>
                  <div className="text-xs text-[#9AA3AD] mt-1.5 leading-relaxed">
                    {event.policy.reason}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Execution Timeline */}
          <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#E8EAED] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#4A9EFF]" />
              Inspection & Execution Timeline
            </div>

            <div className="space-y-4 relative pl-3">
              <div className="absolute left-[17px] top-2 bottom-2 w-px bg-[#1E232A]" />

              {event.timeline.map((step, idx) => {
                const stepTone =
                  step.tone === "allow"
                    ? "bg-[#2ED47A] border-[#2ED47A] text-[#2ED47A]"
                    : step.tone === "block"
                      ? "bg-[#FF4D4F] border-[#FF4D4F] text-[#FF4D4F]"
                      : step.tone === "review"
                        ? "bg-[#F5A524] border-[#F5A524] text-[#F5A524]"
                        : "bg-[#626B76] border-[#626B76] text-[#E8EAED]";

                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 relative z-10"
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full mt-1 shrink-0 ${stepTone.split(" ")[0]}`}
                    />
                    <div className="mono text-xs text-[#E8EAED] leading-relaxed">
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Mock advisory and illustrative event metadata */}
        <div className="space-y-6">
          {/* Advisory analysis is never the authoritative decision. */}
          {event.analysis && (
            <div className="bg-gradient-to-b from-[#4A9EFF]/10 to-[#0E1013] border border-[#4A9EFF]/30 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#4A9EFF]/20">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#4A9EFF]/20 border border-[#4A9EFF]/40 flex items-center justify-center text-[#4A9EFF]">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="mono text-xs font-bold text-[#4A9EFF]">
                        AI SECURITY ADVISOR
                      </span>
                      <span className="mono text-[9px] px-1.5 py-0.5 rounded bg-[#4A9EFF]/15 text-[#4A9EFF] border border-[#4A9EFF]/30 font-semibold tracking-wider uppercase">
                        ADVISORY · NOT AUTHORITATIVE
                      </span>
                    </div>
                    <div className="text-[10px] text-[#626B76]">
                      {event.analysis.engine === "gemini-2.0-flash"
                        ? "Live Gemini contextual analysis · advisory only"
                        : "Deterministic mock analysis · no external model"}
                    </div>
                  </div>
                </div>
                <span className="mono text-[10px] text-[#626B76]">
                  {event.analysis.mitreAtlasId || "AML.T0051"}
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#626B76] block mb-0.5">
                    Inferred Intent
                  </span>
                  <div className="text-[#E8EAED] font-medium mono">
                    {event.analysis.intent}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#626B76] block mb-0.5">
                    Threat Vector
                  </span>
                  <div className="text-[#F5A524] font-medium mono">
                    {event.analysis.threat}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 py-1">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#626B76] block mb-0.5">
                      Risk Level
                    </span>
                    <span
                      className={`mono text-[11px] px-2 py-0.5 rounded font-bold border ${
                        event.analysis.risk === "HIGH" ||
                        event.analysis.risk === "CRITICAL"
                          ? "bg-[#FF4D4F]/15 border-[#FF4D4F]/30 text-[#FF4D4F]"
                          : event.analysis.risk === "MEDIUM"
                            ? "bg-[#F5A524]/15 border-[#F5A524]/30 text-[#F5A524]"
                            : "bg-[#2ED47A]/15 border-[#2ED47A]/30 text-[#2ED47A]"
                      }`}
                    >
                      {event.analysis.risk}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#626B76] block mb-0.5">
                      Confidence
                    </span>
                    <div className="mono text-xs text-[#E8EAED] font-semibold">
                      {event.analysis.confidence}%
                    </div>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-[#626B76] block mb-0.5">
                    AI Reasoning
                  </span>
                  <p className="text-[#9AA3AD] text-[11px] leading-relaxed">
                    {event.analysis.reasoning}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mock outcome card */}
          <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 space-y-2">
            <div className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold">
              Mock Outcome
            </div>
            <div className="flex items-baseline gap-3">
              <div className="mono text-3xl font-bold text-[#2ED47A] leading-none">
                {event.dataExposed}
              </div>
              <div>
                <div className="text-xs font-semibold text-[#E8EAED]">
                  Real Data Accessed
                </div>
                <div className="text-[11px] text-[#626B76]">
                  {event.dataExposed === 0
                    ? "Not applicable; no real tool or data was accessed"
                    : "Illustrative mock value only"}
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-[#1E232A] text-[11px] text-[#626B76] mono">
              Tool call status: {event.status}
            </div>
          </div>

          {/* Illustrative event hash */}
          <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-[#626B76] font-semibold">
              <Hash className="w-3 h-3 text-[#4A9EFF]" />
              <span>Illustrative Mock Hash · Not Tamper-Evident</span>
            </div>
            <div className="mono text-[10px] text-[#9AA3AD] break-all bg-[#08090B] p-2 rounded border border-[#1E232A]">
              {event.hash ||
                "8f7a93c1e2b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0"}
            </div>
            <div className="text-[10px] text-[#3F464E] mono">
              Placeholder value only; no cryptographic integrity guarantee.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
