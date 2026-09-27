import React, { useState } from 'react';
import { SecurityEvent } from '../types/sentinel';
import { AlertTriangle, Lock, CheckCircle, ShieldAlert, ChevronRight, Filter } from 'lucide-react';
import { formatTime, formatTimeShort } from '../utils/engine';

interface SecurityEventsViewProps {
  events: SecurityEvent[];
  onSelectEvent: (id: string) => void;
  onResolveApproval: (id: string, outcome: 'APPROVED' | 'DENIED') => void;
}

export const SecurityEventsView: React.FC<SecurityEventsViewProps> = ({
  events,
  onSelectEvent,
  onResolveApproval,
}) => {
  const [activeTab, setActiveTab] = useState<'ALL' | 'BLOCKED' | 'REVIEW' | 'ALLOWED'>('ALL');

  const blocked = events.filter((e) => e.decision === 'BLOCK');
  const review = events.filter((e) => e.decision === 'REVIEW');
  const allowed = events.filter((e) => e.decision === 'ALLOW');

  const displayedEvents = 
    activeTab === 'BLOCKED' ? blocked :
    activeTab === 'REVIEW' ? review :
    activeTab === 'ALLOWED' ? allowed : events;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#E8EAED] flex items-center gap-2">
          Security Incident Log
        </h1>
        <p className="text-xs text-[#9AA3AD] mt-1 max-w-2xl">
          Complete provenance records of every authorization event, policy violation, and human-in-the-loop review.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E232A] pb-3">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-md text-xs mono font-medium transition-colors cursor-pointer ${
            activeTab === 'ALL'
              ? 'bg-[#14171B] text-[#E8EAED] border border-[#2A3038]'
              : 'text-[#626B76] hover:text-[#9AA3AD]'
          }`}
        >
          All Incidents ({events.length})
        </button>
        <button
          onClick={() => setActiveTab('BLOCKED')}
          className={`px-3 py-1.5 rounded-md text-xs mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'BLOCKED'
              ? 'bg-[#FF4D4F]/15 text-[#FF4D4F] border border-[#FF4D4F]/30'
              : 'text-[#626B76] hover:text-[#FF4D4F]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D4F]" />
          Blocked ({blocked.length})
        </button>
        <button
          onClick={() => setActiveTab('REVIEW')}
          className={`px-3 py-1.5 rounded-md text-xs mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'REVIEW'
              ? 'bg-[#F5A524]/15 text-[#F5A524] border border-[#F5A524]/30'
              : 'text-[#626B76] hover:text-[#F5A524]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#F5A524]" />
          Awaiting Review ({review.length})
        </button>
        <button
          onClick={() => setActiveTab('ALLOWED')}
          className={`px-3 py-1.5 rounded-md text-xs mono font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'ALLOWED'
              ? 'bg-[#2ED47A]/15 text-[#2ED47A] border border-[#2ED47A]/30'
              : 'text-[#626B76] hover:text-[#2ED47A]'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#2ED47A]" />
          Allowed ({allowed.length})
        </button>
      </div>

      {/* Events Table */}
      <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg overflow-hidden">
        <div className="p-3 px-4 border-b border-[#1E232A] bg-[#0A0C0E] grid grid-cols-[80px_140px_1fr_120px_100px] gap-3 text-[11px] uppercase tracking-wider mono text-[#626B76] font-semibold">
          <span>Time</span>
          <span>Agent</span>
          <span>Action / Resource</span>
          <span>Trigger Source</span>
          <span className="text-right">Decision</span>
        </div>

        <div className="divide-y divide-[#1E232A]">
          {displayedEvents.map((evt) => {
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
                className="p-3.5 px-4 hover:bg-[#171B21] transition-colors cursor-pointer group grid grid-cols-[80px_140px_1fr_120px_100px] gap-3 items-center"
              >
                <span className="mono text-xs text-[#626B76]">
                  {formatTimeShort(evt.ts)}
                </span>

                <div className="mono text-xs text-[#9AA3AD] truncate">
                  <div className="font-medium text-[#E8EAED] truncate">{evt.agent.name}</div>
                  <div className="text-[10px] text-[#626B76] truncate">{evt.agent.model}</div>
                </div>

                <div className="min-w-0 pr-2">
                  <div className="mono text-xs text-[#E8EAED] font-medium truncate">
                    {evt.action}
                  </div>
                  <div className="text-[11px] text-[#626B76] truncate mt-0.5">
                    {evt.policy.reason}
                  </div>
                </div>

                <div className="min-w-0">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded mono text-[10px] truncate max-w-full border ${
                      evt.source.trust === 'UNTRUSTED'
                        ? 'bg-[#FF4D4F]/10 border-[#FF4D4F]/25 text-[#FF4D4F]'
                        : 'bg-[#14171B] border-[#2A3038] text-[#626B76]'
                    }`}
                  >
                    {evt.source.trust === 'UNTRUSTED' ? 'UNTRUSTED' : 'TRUSTED'}
                  </span>
                </div>

                <div className="text-right">
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
    </div>
  );
};
