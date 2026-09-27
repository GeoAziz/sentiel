import React, { useState } from 'react';
import { Settings, Shield, Bell, Key, RefreshCw, CheckCircle, Database } from 'lucide-react';

interface SettingsViewProps {
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetDemoData }) => {
  const [strictMode, setStrictMode] = useState(true);
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [mockAdvisory, setMockAdvisory] = useState(true);
  const [multiFactorGating, setMultiFactorGating] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/T00/B00/sentinel-alerts');
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-[#E8EAED] flex items-center gap-2">
          Mock Runtime Settings
        </h1>
        <p className="text-xs text-[#9AA3AD] mt-1">
          Preview-only controls for the demo. Agent and policy changes are managed by the mock API; these settings do not change real systems or send webhooks.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Core Guardrails */}
        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-5 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E8EAED] flex items-center gap-2 pb-2 border-b border-[#1E232A]">
            <Shield className="w-4 h-4 text-[#4A9EFF]" />
            Runtime Authorization Engine
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[#14171B] rounded-md border border-[#1E232A]">
              <div>
                <div className="font-semibold text-[#E8EAED]">Default-Deny Preview</div>
                <div className="text-[11px] text-[#626B76] mt-0.5">
                  Display-only toggle. The mock API always evaluates its active agent policy.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStrictMode(!strictMode)}
                className={`mono text-[10px] px-3 py-1 rounded font-bold border transition-colors cursor-pointer ${
                  strictMode
                    ? 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30'
                    : 'bg-[#14171B] text-[#626B76] border-[#2A3038]'
                }`}
              >
                {strictMode ? 'PREVIEW ON' : 'PREVIEW OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#14171B] rounded-md border border-[#1E232A]">
              <div>
                <div className="font-semibold text-[#E8EAED]">Provenance Quarantine Preview</div>
                <div className="text-[11px] text-[#626B76] mt-0.5">
                  Display-only toggle; request provenance is evaluated by the mock policy API.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoQuarantine(!autoQuarantine)}
                className={`mono text-[10px] px-3 py-1 rounded font-bold border transition-colors cursor-pointer ${
                  autoQuarantine
                    ? 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30'
                    : 'bg-[#14171B] text-[#626B76] border-[#2A3038]'
                }`}
              >
                {autoQuarantine ? 'ACTIVE' : 'OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#14171B] rounded-md border border-[#1E232A]">
              <div>
                <div className="font-semibold text-[#E8EAED]">Deterministic Mock Advisory</div>
                <div className="text-[11px] text-[#626B76] mt-0.5">
                  Local heuristic text only. No external model is called, and this advisory never decides authorization.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMockAdvisory(!mockAdvisory)}
                className={`mono text-[10px] px-3 py-1 rounded font-bold border transition-colors cursor-pointer ${
                  mockAdvisory
                    ? 'bg-[#4A9EFF]/15 text-[#4A9EFF] border-[#4A9EFF]/30'
                    : 'bg-[#14171B] text-[#626B76] border-[#2A3038]'
                }`}
              >
                {mockAdvisory ? 'PREVIEW ON' : 'PREVIEW OFF'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#14171B] rounded-md border border-[#1E232A]">
              <div>
                <div className="font-semibold text-[#E8EAED]">Dual-Key Human-in-the-Loop Gating</div>
                <div className="text-[11px] text-[#626B76] mt-0.5">
                  The approval endpoint records a demo operator decision; no cryptographic identity check is performed.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMultiFactorGating(!multiFactorGating)}
                className={`mono text-[10px] px-3 py-1 rounded font-bold border transition-colors cursor-pointer ${
                  multiFactorGating
                    ? 'bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/30'
                    : 'bg-[#14171B] text-[#626B76] border-[#2A3038]'
                }`}
              >
                {multiFactorGating ? 'MANDATORY' : 'OPTIONAL'}
              </button>
            </div>
          </div>
        </div>

        {/* Webhooks & Alerts */}
        <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-5 space-y-4">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#E8EAED] flex items-center gap-2 pb-2 border-b border-[#1E232A]">
            <Bell className="w-4 h-4 text-[#F5A524]" />
            SIEM &amp; Incident Dispatch
          </div>

          <div>
            <label className="text-[10px] uppercase font-semibold text-[#626B76] block mb-1">
              Demo Webhook URL (not sent)
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs mono text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
            />
            <div className="text-[11px] text-[#626B76] mt-1">
              Preview only. This app does not send webhook requests.
            </div>
          </div>
        </div>

        {/* Save & Reset Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={onResetDemoData}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#14171B] hover:bg-[#1A1E24] border border-[#2A3038] text-[#9AA3AD] hover:text-[#E8EAED] text-xs font-medium cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Demo Incidents &amp; Agents</span>
          </button>

          <div className="flex items-center gap-3">
            {savedNotification && (
              <span className="text-[#2ED47A] mono text-xs flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Settings Saved
              </span>
            )}
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-[#4A9EFF] hover:bg-[#62adff] text-[#04101F] text-xs font-semibold cursor-pointer transition-colors shadow-sm shadow-[#4A9EFF]/20"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
