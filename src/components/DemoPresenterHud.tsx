import React from "react";
import {
  Sparkles,
  X,
  CheckCircle,
  ShieldAlert,
  Lock,
  ArrowRight,
  Play,
  RotateCcw,
} from "lucide-react";

export interface DemoStepInfo {
  stepNumber: number;
  totalSteps: number;
  title: string;
  action: string;
  decision: "ALLOW" | "REVIEW" | "BLOCK";
  talkingPoint: string;
  timestamp: string;
}

interface DemoPresenterHudProps {
  currentStep: DemoStepInfo | null;
  onClose: () => void;
  onReplay: () => void;
}

export const DemoPresenterHud: React.FC<DemoPresenterHudProps> = ({
  currentStep,
  onClose,
  onReplay,
}) => {
  if (!currentStep) return null;

  const toneCls =
    currentStep.decision === "ALLOW"
      ? "bg-[#2ED47A]/15 text-[#2ED47A] border-[#2ED47A]/40"
      : currentStep.decision === "REVIEW"
        ? "bg-[#F5A524]/15 text-[#F5A524] border-[#F5A524]/40"
        : "bg-[#FF4D4F]/15 text-[#FF4D4F] border-[#FF4D4F]/40 shadow-[0_0_15px_rgba(255,77,79,0.3)]";

  const glyph =
    currentStep.decision === "ALLOW"
      ? "✓ ALLOW"
      : currentStep.decision === "REVIEW"
        ? "⚠ REVIEW REQ"
        : "✕ HARD BLOCK";

  return (
    <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="bg-[#0E1013]/95 backdrop-blur-md border border-[#4A9EFF]/30 rounded-xl p-3.5 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_20px_rgba(74,158,255,0.15)] flex flex-col gap-2">
        {/* Top row: Step & Status */}
        <div className="flex items-center justify-between gap-3 pb-2 border-b border-[#1E232A]">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#4A9EFF]/15 border border-[#4A9EFF]/30 text-[#4A9EFF] mono text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#4A9EFF] animate-ping" />
              90-SEC DEMO HUD · STEP {currentStep.stepNumber}/
              {currentStep.totalSteps}
            </span>
            <span className="mono text-xs text-[#E8EAED] font-semibold truncate max-w-xs">
              {currentStep.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`mono text-[10px] px-2 py-0.5 rounded font-bold border ${toneCls}`}
            >
              {glyph}
            </span>
            <button
              onClick={onReplay}
              title="Replay Demo"
              className="p-1 text-[#626B76] hover:text-[#E8EAED] hover:bg-[#1A1E24] rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              title="Close Presenter HUD"
              className="p-1 text-[#626B76] hover:text-[#E8EAED] hover:bg-[#1A1E24] rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom row: Judge Talking Point Callout */}
        <div className="flex items-start gap-2 text-xs">
          <span className="mono text-[10px] text-[#A78BFA] font-bold uppercase shrink-0 pt-0.5">
            PITCH CUE:
          </span>
          <p className="text-[#E8EAED] font-medium leading-relaxed">
            &ldquo;{currentStep.talkingPoint}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
};
