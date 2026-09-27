import React from 'react';
import { Play, Pause, FlaskConical, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

interface TopBarProps {
  breadcrumbs: string[];
  isLive: boolean;
  onToggleLive: () => void;
  onRunDemo: () => void;
  isDemoRunning: boolean;
  onOpenSandbox: () => void;
  pendingApprovalsCount: number;
  onNavigateToApprovals: () => void;
  onNavigateToLanding: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  breadcrumbs,
  isLive,
  onToggleLive,
  onRunDemo,
  isDemoRunning,
  onOpenSandbox,
  pendingApprovalsCount,
  onNavigateToApprovals,
  onNavigateToLanding,
}) => {
  return (
    <header className="h-14 border-b border-[#1E232A] flex items-center justify-between px-6 bg-[#08090B] shrink-0 z-10 select-none">
      {/* Breadcrumb Path */}
      <div className="flex items-center gap-2 mono text-xs text-[#626B76]">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={idx}>
              <span className={isLast ? 'text-[#E8EAED] font-medium' : 'text-[#626B76]'}>
                {crumb}
              </span>
              {!isLast && <span className="text-[#3F464E]">/</span>}
            </React.Fragment>
          );
        })}
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Landing Page Link */}
        <button
          onClick={onNavigateToLanding}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#14171B] border border-[#2A3038] hover:border-[#5B45FF] text-[#A78BFA] hover:text-white text-xs font-semibold transition-all cursor-pointer"
        >
          <span>🌐 Homepage</span>
        </button>
        {/* Pending approvals badge button */}
        {pendingApprovalsCount > 0 && (
          <button
            onClick={onNavigateToApprovals}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F5A524]/10 border border-[#F5A524]/30 text-[#F5A524] text-xs mono font-medium hover:bg-[#F5A524]/20 transition-all cursor-pointer animate-pulse"
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{pendingApprovalsCount} REVIEW REQUIRED</span>
          </button>
        )}

        {/* Live Stream Toggle Pill */}
        <button
          onClick={onToggleLive}
          className={`flex items-center gap-2 px-3 py-1 rounded-full mono text-[11px] font-medium tracking-wider border transition-all cursor-pointer ${
            isLive
              ? 'bg-[#2ED47A]/10 border-[#2ED47A]/30 text-[#2ED47A]'
              : 'bg-[#14171B] border-[#2A3038] text-[#626B76]'
          }`}
          title="Toggle live telemetry feed stream"
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isLive ? 'bg-[#2ED47A] shadow-[0_0_8px_rgba(46,212,122,0.8)] animate-pulse-green' : 'bg-[#626B76]'
            }`}
          />
          <span>{isLive ? 'STREAMING' : 'PAUSED'}</span>
        </button>

        {/* Test Sandbox Trigger */}
        <button
          onClick={onOpenSandbox}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#14171B] border border-[#2A3038] hover:border-[#363D47] text-[#E8EAED] hover:bg-[#1A1E24] text-xs font-medium transition-all cursor-pointer"
        >
          <FlaskConical className="w-3.5 h-3.5 text-[#4A9EFF]" />
          <span>Intercept Sandbox</span>
        </button>

        {/* Run Demo Button */}
        <button
          onClick={onRunDemo}
          disabled={isDemoRunning}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer ${
            isDemoRunning
              ? 'bg-[#4A9EFF]/20 border border-[#4A9EFF]/30 text-[#4A9EFF] opacity-80 cursor-wait'
              : 'bg-[#4A9EFF] hover:bg-[#62adff] text-[#04101F] shadow-md shadow-[#4A9EFF]/15'
          }`}
        >
          <Play className={`w-3.5 h-3.5 ${isDemoRunning ? 'animate-spin' : ''}`} />
          <span>{isDemoRunning ? 'Simulating Attack Scenario...' : 'Run Demo'}</span>
        </button>
      </div>
    </header>
  );
};
