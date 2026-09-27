import React, { useState } from 'react';
import { Settings, Shield, Bell, Key, RefreshCw, CheckCircle, Database } from 'lucide-react';

interface SettingsViewProps {
  onResetDemoData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onResetDemoData }) => {
  const [strictMode, setStrictMode] = useState(true);
  const [autoQuarantine, setAutoQuarantine] = useState(true);
  const [geminiInspection, setGeminiInspection] = useState(true);
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
          Security Gateway Settings
        </h1>
        <p className="text-xs text-[#9AA3AD] mt-1">
          Configure runtime authorization thresholds, SIEM integrations, and Gemini 3.8 Flash threat inspection parameters.
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
                <div className="font-semibold text-[#E8EAED]">Strict Zero-Trust Perimeter (Default Deny)</div>
                <div className="text-[11px] text-[#626B76] mt-0.5">
                  Block any capability or tool call not explicitly whitelisted in the active agent policy.
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
                {strictMode ? 'ENFORCING' : 'PERMISSIVE'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#14171B] rounded-md border border-[#1E232A]">
              <div>
                <div className="font-semibold text-[#E8EAED]">Untrusted Provenance Taint Quarantine</div>
                <div className="text-[11px] text-[#626B76] mt-0.5">
                  Automatically isolate agent sessions if instructions originate from unverified third-party content.
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
                <div className="font-semibold text-[#E8EAED]">Gemini 3.8 Flash Deep Threat Inspection</div>
                <div className="text-[11px] text-[#626B76] mt-0.5">
                  Analyze runtime tool invocation semantics with LLM reasoning to catch subtle prompt injection.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGeminiInspection(!geminiInspection)}
                className={`mono text-[10px] px-3 py-1 rounded font-bold border transition-colors cursor-pointer ${
                  geminiInspection
                    ? 'bg-[#4A9EFF]/15 text-[#4A9EFF] border-[#4A9EFF]/30'
                    : 'bg-[#14171B] text-[#626B76] border-[#2A3038]'
                }`}
              >
                {geminiInspection ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#14171B] rounded-md border border-[#1E232A]">
              <div>
                <div className="font-semibold text-[#E8EAED]">Dual-Key Human-in-the-Loop Gating</div>
                <div className="text-[11px] text-[#626B76] mt-0.5">
                  Require operator cryptographic approval on production rollouts and database schema modifications.
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
              Real-Time Security Webhook URL
            </label>
            <input
              type="text"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              className="w-full bg-[#14171B] border border-[#2A3038] rounded-md p-2 text-xs mono text-[#E8EAED] focus:outline-none focus:border-[#4A9EFF]"
            />
            <div className="text-[11px] text-[#626B76] mt-1">
              Receives instant JSON payloads whenever Sentinel records a BLOCK or REVIEW event.
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
