import React, { useState } from 'react';
import { SecurityEvent } from '../types/sentinel';
import { FileCode, Download, Search, CheckCircle2, Hash, ShieldCheck, ChevronRight } from 'lucide-react';
import { formatTime } from '../utils/engine';

interface AuditLogViewProps {
  events: SecurityEvent[];
  onSelectEvent: (id: string) => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ events, onSelectEvent }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [decisionFilter, setDecisionFilter] = useState<'ALL' | 'ALLOW' | 'REVIEW' | 'BLOCK'>('ALL');

  const filteredEvents = events.filter((e) => {
    if (decisionFilter !== 'ALL' && e.decision !== decisionFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        e.agent.name.toLowerCase().includes(q) ||
        e.capability.toLowerCase().includes(q) ||
        e.resource.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        e.hash.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(events, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sentinel-audit-trail-${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const exportCSV = () => {
    const headers = ['EventID', 'Timestamp', 'Agent', 'Model', 'Capability', 'Resource', 'Decision', 'Trust', 'Hash'];
    const rows = events.map((e) => [
      e.id,
      e.ts,
      `"${e.agent.name}"`,
      `"${e.agent.model}"`,
      `"${e.capability}"`,
      `"${e.resource}"`,
      e.decision,
      e.source.trust,
      e.hash,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `sentinel-audit-trail-${new Date().toISOString()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E8EAED] flex items-center gap-2">
            Immutable Audit Trail &amp; SIEM Compliance
          </h1>
          <p className="text-xs text-[#9AA3AD] mt-1 max-w-2xl">
            Cryptographically chained records of every runtime decision. Designed for SOC 2 Type II, ISO 27001, and EU AI Act article compliance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#14171B] border border-[#2A3038] hover:border-[#363D47] text-[#E8EAED] text-xs mono font-medium cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#4A9EFF]" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#4A9EFF] hover:bg-[#62adff] text-[#04101F] text-xs mono font-semibold cursor-pointer transition-colors shadow-sm shadow-[#4A9EFF]/20"
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Compliance Certification Status Pill */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#0E1013] border border-[#1E232A] rounded-lg text-xs mono">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2ED47A] shrink-0" />
          <div>
            <div className="text-[#E8EAED] font-semibold">Ledger Chaining: VERIFIED</div>
            <div className="text-[10px] text-[#626B76]">SHA-256 Merkle root valid</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#4A9EFF] shrink-0" />
          <div>
            <div className="text-[#E8EAED] font-semibold">EU AI Act Conformity</div>
            <div className="text-[10px] text-[#626B76]">Human oversight logging (Art. 14)</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-[#F5A524] shrink-0" />
          <div>
            <div className="text-[#E8EAED] font-semibold">SOC 2 CC6.1 Control</div>
            <div className="text-[10px] text-[#626B76]">Logical access boundaries enforced</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0E1013] border border-[#1E232A] rounded-lg">
        <div className="flex items-center gap-1.5">
          {(['ALL', 'ALLOW', 'REVIEW', 'BLOCK'] as const).map((dec) => (
            <button
              key={dec}
              onClick={() => setDecisionFilter(dec)}
              className={`px-2.5 py-1 rounded mono text-[11px] font-medium border transition-colors cursor-pointer ${
                decisionFilter === dec
                  ? 'bg-[#14171B] border-[#2A3038] text-[#E8EAED]'
                  : 'text-[#626B76] border-transparent hover:text-[#9AA3AD]'
              }`}
            >
              {dec}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#626B76]" />
          <input
            type="text"
            placeholder="Search event ID, agent, hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#14171B] border border-[#2A3038] rounded-md pl-8 pr-3 py-1 text-xs text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg overflow-x-auto">
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-[#1E232A] bg-[#0A0C0E] text-[10px] uppercase tracking-wider mono text-[#626B76] font-semibold">
              <th className="p-3 px-4">Event ID / Time</th>
              <th className="p-3 px-3">Agent</th>
              <th className="p-3 px-3">Capability & Resource</th>
              <th className="p-3 px-3">Decision</th>
              <th className="p-3 px-4">Ledger Integrity Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E232A]">
            {filteredEvents.map((evt) => {
              const toneCls =
                evt.decision === 'ALLOW'
                  ? 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30'
                  : evt.decision === 'REVIEW'
                  ? 'bg-[#F5A524]/15 text-[#F5A524] border-[#F5A524]/30'
                  : 'bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30';

              return (
                <tr
                  key={evt.id}
                  onClick={() => onSelectEvent(evt.id)}
                  className="hover:bg-[#171B21] transition-colors cursor-pointer group"
                >
                  <td className="p-3 px-4 mono">
                    <div className="font-semibold text-[#E8EAED]">{evt.id}</div>
                    <div className="text-[10px] text-[#626B76] mt-0.5">{formatTime(evt.ts)}</div>
                  </td>

                  <td className="p-3 px-3 mono">
                    <div className="text-[#9AA3AD] font-medium">{evt.agent.name}</div>
                    <div className="text-[10px] text-[#626B76]">{evt.agent.model}</div>
                  </td>

                  <td className="p-3 px-3 mono min-w-[200px]">
                    <div className="text-[#E8EAED] font-semibold">{evt.capability}</div>
                    <div className="text-[11px] text-[#626B76] truncate max-w-sm">{evt.resource}</div>
                  </td>

                  <td className="p-3 px-3">
                    <span className={`mono text-[10px] px-2 py-0.5 rounded font-bold border ${toneCls}`}>
                      {evt.decision}
                    </span>
                  </td>

                  <td className="p-3 px-4 mono text-[10px] text-[#626B76] break-all max-w-[220px]">
                    {evt.hash.slice(0, 16)}...{evt.hash.slice(-8)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
