import React, { useEffect } from 'react';
import { SecurityEvent } from '../types/sentinel';
import { ShieldAlert, ArrowRight, CheckCircle2, X, ExternalLink, Lock } from 'lucide-react';
import { formatTime } from '../utils/engine';

interface TakeoverModalProps {
  event: SecurityEvent | null;
  onClose: () => void;
  onViewEvent: (id: string) => void;
}

export const TakeoverModal: React.FC<TakeoverModalProps> = ({ event, onClose, onViewEvent }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#040507]/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full max-w-[620px] bg-[#0E1013] border border-[#FF4D4F]/35 rounded-xl shadow-[0_0_80px_rgba(255,77,79,0.22),0_30px_80px_rgba(0,0,0,0.8)] overflow-hidden relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Subtle radial glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,77,79,0.12),transparent_60%)]" />

        {/* Modal Header */}
        <div className="p-5 px-6 border-b border-[#FF4D4F]/25 flex items-center justify-between relative bg-[#0E1013]/90">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#FF4D4F]/10 border border-[#FF4D4F]/30 flex items-center justify-center text-[#FF4D4F] animate-pulse-block shrink-0">
              <X className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="mono font-bold tracking-[0.16em] text-[15px] text-[#FF4D4F]">
                ACTION BLOCKED
              </div>
              <div className="mono text-xs text-[#9AA3AD] mt-0.5">
                Sentinel intercepted and neutralized unauthorized tool invocation
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-[#626B76] hover:text-[#E8EAED] p-1.5 rounded-md hover:bg-[#1A1E24] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Enforcement Pipeline Step Indicator */}
        <div className="py-3 px-6 border-b border-[#1E232A] bg-[#090B0D] flex items-center justify-center gap-2 mono text-[11px] tracking-wider select-none overflow-x-auto">
          <div className="px-2.5 py-1 rounded bg-[#4A9EFF]/10 border border-[#4A9EFF]/30 text-[#4A9EFF] font-medium">
            1. AGENT REQUEST
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#3F464E] shrink-0" />
          <div className="px-2.5 py-1 rounded bg-[#4A9EFF]/10 border border-[#4A9EFF]/30 text-[#4A9EFF] font-medium">
            2. TAINT INSPECTION
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#3F464E] shrink-0" />
          <div className="px-2.5 py-1 rounded bg-[#4A9EFF]/10 border border-[#4A9EFF]/30 text-[#4A9EFF] font-medium">
            3. POLICY ENGINE
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-[#3F464E] shrink-0" />
          <div className="px-2.5 py-1 rounded bg-[#FF4D4F]/15 border border-[#FF4D4F]/40 text-[#FF4D4F] font-semibold shadow-[0_0_15px_rgba(255,77,79,0.3)]">
            4. HARD BLOCK
          </div>
        </div>

        {/* Details Table */}
        <div className="p-6 space-y-3">
          <div className="grid grid-cols-[120px_1fr] gap-3 py-2 border-b border-[#1E232A] items-baseline">
            <span className="text-[11px] uppercase tracking-wider text-[#626B76] font-semibold">
              Target Agent
            </span>
            <span className="mono text-sm text-[#E8EAED]">
              {event.agent.name}{' '}
              <span className="text-[#626B76] text-xs">({event.agent.model})</span>
            </span>
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-3 py-2 border-b border-[#1E232A] items-baseline">
            <span className="text-[11px] uppercase tracking-wider text-[#626B76] font-semibold">
              Attempted Action
            </span>
            <span className="mono text-sm text-[#4A9EFF] font-medium break-all">
              {event.capability}(&ldquo;{event.resource}&rdquo;)
            </span>
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-3 py-2 border-b border-[#1E232A] items-baseline">
            <span className="text-[11px] uppercase tracking-wider text-[#626B76] font-semibold">
              Trigger Origin
            </span>
            <span className="mono text-xs text-[#E8EAED]">
              {event.source.origin}
            </span>
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-3 py-2 border-b border-[#1E232A] items-baseline">
            <span className="text-[11px] uppercase tracking-wider text-[#626B76] font-semibold">
              Source Trust
            </span>
            <div>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded mono text-[10px] font-semibold border ${
                event.source.trust === 'UNTRUSTED'
                  ? 'bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/35'
                  : 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/35'
              }`}>
                {event.source.trust}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-[120px_1fr] gap-3 py-2 items-baseline">
            <span className="text-[11px] uppercase tracking-wider text-[#626B76] font-semibold">
              Policy Reason
            </span>
            <span className="text-xs text-[#9AA3AD] leading-relaxed">
              {event.policy.reason}
            </span>
          </div>
        </div>

        {/* 0 Data Exposed Assurance Banner */}
        <div className="mx-6 mb-5 p-3.5 px-4 rounded-lg bg-[#2ED47A]/10 border border-[#2ED47A]/25 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#2ED47A] shrink-0" />
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] font-semibold text-[#626B76]">
                Sensitive Data Exposed
              </div>
              <div className="mono text-xl font-bold text-[#2ED47A] leading-tight">
                0 BYTES
              </div>
            </div>
          </div>
          <div className="mono text-xs text-[#626B76] text-right">
            Sandbox boundary preserved <br />
            Subprocess execution suppressed
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-[#1E232A] bg-[#0A0C0E] flex items-center justify-between">
          <div className="mono text-[11px] text-[#626B76]">
            {event.id} · {formatTime(event.ts)}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onViewEvent(event.id);
              }}
              className="px-3 py-1.5 rounded-md bg-[#14171B] hover:bg-[#1A1E24] border border-[#2A3038] text-[#E8EAED] text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#4A9EFF]" />
              <span>Inspect Event</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-md bg-[#FF4D4F] hover:bg-[#ff686a] text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm shadow-[#FF4D4F]/20"
            >
              Acknowledge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
