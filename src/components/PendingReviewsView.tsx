import React, { useState } from 'react';
import { SecurityEvent } from '../types/sentinel';
import { Lock, CheckCircle, XCircle, AlertTriangle, ShieldCheck, ChevronRight, Clock, UserCheck } from 'lucide-react';
import { formatTime } from '../utils/engine';

interface PendingReviewsViewProps {
  events: SecurityEvent[];
  onResolveApproval: (id: string, outcome: 'APPROVED' | 'DENIED', reason?: string) => void;
  onSelectEvent: (id: string) => void;
}

export const PendingReviewsView: React.FC<PendingReviewsViewProps> = ({
  events,
  onResolveApproval,
  onSelectEvent,
}) => {
  const pendingReviews = events.filter((e) => e.decision === 'REVIEW' && e.status === 'PENDING');
  const resolvedReviews = events.filter((e) => e.approval !== undefined);

  const [activeTab, setActiveTab] = useState<'PENDING' | 'RESOLVED'>('PENDING');
  const [denyReasonModal, setDenyReasonModal] = useState<string | null>(null);
  const [denyReasonText, setDenyReasonText] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#E8EAED] flex items-center gap-2">
          Human-in-the-Loop Authorization Queue
        </h1>
        <p className="text-xs text-[#9AA3AD] mt-1 max-w-2xl">
          Privileged operations (e.g. production deployments, schema migrations, sensitive branch pushes) are paused at runtime until certified by a human security operator.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#1E232A] pb-3">
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-3 py-1.5 rounded-md text-xs mono font-medium transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'PENDING'
              ? 'bg-[#F5A524]/15 text-[#F5A524] border border-[#F5A524]/30'
              : 'text-[#626B76] hover:text-[#9AA3AD]'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Pending Reviews ({pendingReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('RESOLVED')}
          className={`px-3 py-1.5 rounded-md text-xs mono font-medium transition-colors flex items-center gap-2 cursor-pointer ${
            activeTab === 'RESOLVED'
              ? 'bg-[#14171B] text-[#E8EAED] border border-[#2A3038]'
              : 'text-[#626B76] hover:text-[#9AA3AD]'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Audit Resolution History ({resolvedReviews.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'PENDING' ? (
        <div className="space-y-4">
          {pendingReviews.length === 0 ? (
            <div className="p-12 text-center bg-[#0E1013] border border-[#1E232A] rounded-lg">
              <CheckCircle className="w-8 h-8 text-[#2ED47A] mx-auto mb-2 opacity-80" />
              <div className="text-sm font-semibold text-[#E8EAED]">Queue Clean</div>
              <div className="text-xs text-[#626B76] mt-1 mono">
                No autonomous agent actions currently awaiting human supervisor authorization.
              </div>
            </div>
          ) : (
            pendingReviews.map((evt) => (
              <div
                key={evt.id}
                className="bg-[#0E1013] border border-[#F5A524]/30 rounded-lg p-5 space-y-4 relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[#1E232A]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-[#F5A524]/15 border border-[#F5A524]/30 flex items-center justify-center text-[#F5A524]">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="mono text-xs font-bold text-[#E8EAED] flex items-center gap-2">
                        <span>{evt.agent.name}</span>
                        <span className="text-[#626B76]">·</span>
                        <span className="text-[#4A9EFF]">{evt.capability}</span>
                      </div>
                      <div className="text-[10px] text-[#626B76] mono">
                        {evt.id} · Requested {formatTime(evt.ts)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="mono text-[10px] px-2 py-0.5 rounded bg-[#F5A524]/15 text-[#F5A524] border border-[#F5A524]/30 font-semibold">
                      SUPERVISOR APPROVAL REQUIRED
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold block mb-1">
                      Resource Target & Parameters
                    </span>
                    <div className="mono text-[#E8EAED] bg-[#14171B] p-2.5 rounded border border-[#1E232A] break-all">
                      {evt.action}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#626B76] font-semibold block mb-1">
                      Gating Policy
                    </span>
                    <div className="text-[#9AA3AD] leading-relaxed bg-[#14171B] p-2.5 rounded border border-[#1E232A]">
                      {evt.policy.name}: {evt.policy.reason}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1E232A]">
                  <button
                    onClick={() => onSelectEvent(evt.id)}
                    className="text-xs text-[#4A9EFF] hover:underline flex items-center gap-1 mono cursor-pointer"
                  >
                    <span>Inspect Full 5Ws Record</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setDenyReasonModal(evt.id)}
                      className="px-3.5 py-1.5 rounded bg-[#FF4D4F]/15 hover:bg-[#FF4D4F]/25 text-[#FF4D4F] border border-[#FF4D4F]/30 text-xs font-semibold mono cursor-pointer transition-colors"
                    >
                      DENY REQUEST
                    </button>
                    <button
                      onClick={() => onResolveApproval(evt.id, 'APPROVED')}
                      className="px-4 py-1.5 rounded bg-[#4A9EFF] hover:bg-[#62adff] text-[#04101F] text-xs font-semibold mono cursor-pointer transition-colors shadow-sm shadow-[#4A9EFF]/20"
                    >
                      APPROVE & EXECUTE
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* Resolved Reviews List */
        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg overflow-hidden divide-y divide-[#1E232A]">
          {resolvedReviews.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#626B76] mono">
              No previous human approvals or rejections in audit log.
            </div>
          ) : (
            resolvedReviews.map((evt) => (
              <div
                key={evt.id}
                onClick={() => onSelectEvent(evt.id)}
                className="p-4 hover:bg-[#171B21] transition-colors cursor-pointer flex items-center justify-between gap-4"
              >
                <div>
                  <div className="mono text-xs font-semibold text-[#E8EAED]">
                    {evt.agent.name} — {evt.action}
                  </div>
                  <div className="text-[11px] text-[#626B76] mt-0.5 mono">
                    Resolved by {evt.approval?.operator || 'Security Operator'} at{' '}
                    {formatTime(evt.approval?.resolvedAt || evt.ts)}
                  </div>
                </div>

                <div>
                  <span
                    className={`mono text-[10px] px-2 py-0.5 rounded font-bold border ${
                      evt.approval?.outcome === 'APPROVED'
                        ? 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30'
                        : 'bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/30'
                    }`}
                  >
                    {evt.approval?.outcome === 'APPROVED' ? 'APPROVED' : 'DENIED'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Deny Reason Modal */}
      {denyReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0E1013] border border-[#FF4D4F]/40 rounded-xl p-5 space-y-4">
            <div className="flex items-center gap-2 text-[#FF4D4F] font-bold mono text-sm">
              <XCircle className="w-5 h-5" />
              <span>Deny Autonomous Request</span>
            </div>
            <p className="text-xs text-[#9AA3AD]">
              Provide an audit justification for denying this runtime tool execution. The agent will receive a sanitized authorization denial.
            </p>
            <textarea
              value={denyReasonText}
              onChange={(e) => setDenyReasonText(e.target.value)}
              placeholder="e.g. Blast radius exceeds standard window; change freezes active."
              rows={3}
              className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2.5 text-xs text-[#E8EAED] focus:outline-none focus:border-[#FF4D4F]"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDenyReasonModal(null)}
                className="px-3 py-1.5 rounded text-xs text-[#9AA3AD] hover:bg-[#14171B]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResolveApproval(denyReasonModal, 'DENIED', denyReasonText || 'Operator rejected request');
                  setDenyReasonModal(null);
                  setDenyReasonText('');
                }}
                className="px-4 py-1.5 rounded bg-[#FF4D4F] hover:bg-[#ff6567] text-white text-xs font-semibold mono"
              >
                Confirm Denial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
