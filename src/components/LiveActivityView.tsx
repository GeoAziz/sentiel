import React, { useState } from 'react';
import { SecurityEvent, Decision } from '../types/sentinel';
import { Search, Filter, Radio, ArrowRight, ShieldAlert, CheckCircle, Clock, Pause, Play, Trash2 } from 'lucide-react';
import { formatTime } from '../utils/engine';

interface LiveActivityViewProps {
  events: SecurityEvent[];
  isLive: boolean;
  streamConnected: boolean;
  onToggleLive: () => void;
  onSelectEvent: (id: string) => void;
  onClearStream?: () => void;
}

export const LiveActivityView: React.FC<LiveActivityViewProps> = ({
  events,
  isLive,
  streamConnected,
  onToggleLive,
  onSelectEvent,
  onClearStream,
}) => {
  const [filterDecision, setFilterDecision] = useState<'ALL' | Decision>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((e) => {
    if (filterDecision !== 'ALL' && e.decision !== filterDecision) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.agent.name.toLowerCase().includes(q) ||
        e.capability.toLowerCase().includes(q) ||
        e.resource.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E8EAED] flex items-center gap-2">
            Mock Authorization Event Stream
          </h1>
          <p className="text-xs text-[#9AA3AD] mt-0.5">
            API-backed decisions from this demo process. No real agent tools are run.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLive}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md mono text-xs font-medium border transition-colors cursor-pointer ${
              isLive
                ? 'bg-[#2ED47A]/10 border-[#2ED47A]/30 text-[#2ED47A]'
                : 'bg-[#14171B] border-[#2A3038] text-[#9AA3AD]'
            }`}
          >
            {isLive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isLive ? 'Pause Stream' : 'Resume Stream'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0E1013] border border-[#1E232A] rounded-lg">
        {/* Decision Filters */}
        <div className="flex items-center gap-1.5">
          {(['ALL', 'ALLOW', 'REVIEW', 'BLOCK'] as const).map((dec) => {
            const count = dec === 'ALL' ? events.length : events.filter((e) => e.decision === dec).length;
            const isSelected = filterDecision === dec;

            return (
              <button
                key={dec}
                onClick={() => setFilterDecision(dec)}
                className={`px-2.5 py-1 rounded mono text-[11px] font-medium border transition-all cursor-pointer ${
                  isSelected
                    ? dec === 'ALLOW'
                      ? 'bg-[#2ED47A]/20 border-[#2ED47A] text-[#2ED47A]'
                      : dec === 'REVIEW'
                      ? 'bg-[#F5A524]/20 border-[#F5A524] text-[#F5A524]'
                      : dec === 'BLOCK'
                      ? 'bg-[#FF4D4F]/20 border-[#FF4D4F] text-[#FF4D4F]'
                      : 'bg-[#4A9EFF]/20 border-[#4A9EFF] text-[#4A9EFF]'
                    : 'bg-[#14171B] border-[#2A3038] text-[#9AA3AD] hover:bg-[#1A1E24]'
                }`}
              >
                {dec} ({count})
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#626B76]" />
          <input
            type="text"
            placeholder="Filter agent, capability, resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#14171B] border border-[#2A3038] rounded-md pl-8 pr-3 py-1 text-xs text-[#E8EAED] placeholder-[#626B76] focus:outline-none focus:border-[#4A9EFF]"
          />
        </div>
      </div>

      {/* Events Stream Panel */}
      <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg overflow-hidden">
        <div className="p-3 px-4 border-b border-[#1E232A] flex items-center justify-between text-xs mono text-[#626B76] bg-[#0A0C0E]">
          <span>STREAM BUFFER ({filteredEvents.length} events)</span>
          <span className={`flex items-center gap-1 ${streamConnected ? 'text-[#2ED47A]' : 'text-[#F5A524]'}`}>
            <Radio className={`w-3 h-3 ${streamConnected ? 'animate-pulse' : ''}`} />
            {streamConnected ? 'Mock API connected' : isLive ? 'Connecting to mock API' : 'Stream paused'}
          </span>
        </div>

        <div className="divide-y divide-[#1E232A] max-h-[640px] overflow-y-auto">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center text-[#626B76] mono text-xs">
              No tool events matching selected filter.
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const toneCls =
                evt.decision === 'ALLOW'
                  ? 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30'
                  : evt.decision === 'REVIEW'
                  ? 'bg-[#F5A524]/15 text-[#F5A524] border-[#F5A524]/30'
                  : 'bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30';

              const glyph = evt.decision === 'ALLOW' ? '✓' : evt.decision === 'REVIEW' ? '⚠' : '✕';

              const parts = evt.action.split(' ');
              const fn = parts[0];
              const arg = parts.slice(1).join(' ');

              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt.id)}
                  className="p-3 px-4 hover:bg-[#171B21] transition-colors cursor-pointer group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                >
                  <div className="flex items-start sm:items-center gap-3 min-w-0">
                    <span className="mono text-[11px] text-[#626B76] w-16 shrink-0 pt-0.5 sm:pt-0">
                      {formatTime(evt.ts)}
                    </span>
                    <span className="mono text-xs text-[#9AA3AD] w-28 shrink-0 truncate font-medium">
                      {evt.agent.name}
                    </span>
                    <div className="flex items-center gap-2 mono text-xs min-w-0">
                      <span className="text-[#3F464E]">→</span>
                      <span className="text-[#4A9EFF] font-semibold">{fn}</span>
                      {arg && (
                        <span className="text-[#F5A524] truncate max-w-xs sm:max-w-md">
                          (&ldquo;{arg}&rdquo;)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {evt.source.trust === 'UNTRUSTED' && (
                      <span className="mono text-[10px] text-[#FF4D4F] px-1.5 py-0.5 rounded bg-[#FF4D4F]/10 border border-[#FF4D4F]/25">
                        UNTRUSTED ORIGIN
                      </span>
                    )}
                    <span className={`mono text-[10px] px-2 py-0.5 rounded font-semibold border ${toneCls}`}>
                      <span className="mr-1">{glyph}</span>
                      {evt.decision}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
