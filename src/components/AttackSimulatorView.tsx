import React, { useState } from 'react';
import { AttackScenario, SecurityEvent } from '../types/sentinel';
import { 
  Radio, 
  Play, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Terminal, 
  ArrowRight, 
  Sparkles, 
  RotateCcw,
  Zap,
  Check
} from 'lucide-react';

interface AttackSimulatorViewProps {
  scenarios: AttackScenario[];
  onExecuteScenario: (scenario: AttackScenario) => Promise<SecurityEvent>;
  isExecuting: boolean;
}

export const AttackSimulatorView: React.FC<AttackSimulatorViewProps> = ({
  scenarios,
  onExecuteScenario,
  isExecuting,
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0]?.id || '');
  const [testResults, setTestResults] = useState<Record<string, 'PASS' | 'FAIL' | 'RUNNING'>>({});
  const [activeStepIndex, setActiveStepIndex] = useState<number>(-1);

  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  const handleRunSingle = async (scenario: AttackScenario) => {
    setTestResults((prev) => ({ ...prev, [scenario.id]: 'RUNNING' }));
    setActiveStepIndex(0);

    // Step-by-step animation
    for (let i = 0; i < scenario.steps.length; i++) {
      setActiveStepIndex(i);
      await new Promise((r) => setTimeout(r, 260));
    }

    try {
      const event = await onExecuteScenario(scenario);
      const defended = event.decision === 'BLOCK' || event.status === 'PENDING';
      setTestResults((prev) => ({ ...prev, [scenario.id]: defended ? 'PASS' : 'FAIL' }));
    } catch {
      setTestResults((prev) => ({ ...prev, [scenario.id]: 'FAIL' }));
    }
  };

  const handleRunAll = async () => {
    for (const sc of scenarios) {
      setActiveScenarioId(sc.id);
      await handleRunSingle(sc);
    }
  };

  const passCount = Object.values(testResults).filter((v) => v === 'PASS').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#E8EAED] flex items-center gap-2">
            Mock Attack Scenario Lab
          </h1>
          <p className="text-xs text-[#9AA3AD] mt-1 max-w-2xl">
            Send simulated adversarial requests to the mock policy API. No real agent or tool is invoked.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {passCount > 0 && (
            <div className="mono text-xs text-[#2ED47A] bg-[#2ED47A]/10 border border-[#2ED47A]/25 px-2.5 py-1 rounded">
              {passCount}/{scenarios.length} mock checks passed
            </div>
          )}
          <button
            onClick={handleRunAll}
            disabled={isExecuting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#4A9EFF] hover:bg-[#62adff] text-[#04101F] text-xs font-semibold cursor-pointer transition-colors shadow-sm shadow-[#4A9EFF]/20 disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Run All Attacks</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Attack Scenarios Cards + Detailed Execution Console */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of Scenarios */}
        <div className="space-y-3">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-[#626B76] px-1">
            Attack Vectors ({scenarios.length})
          </div>

          <div className="space-y-2">
            {scenarios.map((sc) => {
              const isSelected = sc.id === activeScenario.id;
              const result = testResults[sc.id];

              return (
                <div
                  key={sc.id}
                  onClick={() => {
                    setActiveScenarioId(sc.id);
                    setActiveStepIndex(-1);
                  }}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-[#14171B] border-[#4A9EFF]/50 shadow-md'
                      : 'bg-[#0E1013] border-[#1E232A] hover:border-[#2A3038] hover:bg-[#171B21]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="mono text-xs font-bold text-[#E8EAED]">
                      {sc.name}
                    </span>
                    {result === 'PASS' ? (
                      <span className="mono text-[10px] px-1.5 py-0.2 rounded bg-[#2ED47A]/15 text-[#2ED47A] border border-[#2ED47A]/30 font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> PASS
                      </span>
                    ) : result === 'FAIL' ? (
                      <span className="mono text-[10px] px-1.5 py-0.2 rounded bg-[#FF4D4F]/15 text-[#FF4D4F] border border-[#FF4D4F]/30 font-bold">FAIL</span>
                    ) : result === 'RUNNING' ? (
                      <span className="mono text-[10px] px-1.5 py-0.2 rounded bg-[#4A9EFF]/15 text-[#4A9EFF] border border-[#4A9EFF]/30 font-bold animate-pulse">
                        TESTING...
                      </span>
                    ) : (
                      <span className="mono text-[10px] text-[#626B76]">READY</span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#9AA3AD] mt-1 line-clamp-1">
                    {sc.category}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Selected Scenario Breakdown & Step Execution */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0E1013] border border-[#1E232A] rounded-lg p-5 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-[#1E232A]">
              <div>
                <div className="mono text-xs text-[#4A9EFF] font-semibold">
                  {activeScenario.category}
                </div>
                <h2 className="text-base font-bold text-[#E8EAED] mt-0.5">
                  {activeScenario.name}
                </h2>
                <div className="mono text-[11px] text-[#626B76] mt-0.5">
                  MITRE Code: {activeScenario.mitreCode}
                </div>
              </div>

              <button
                onClick={() => handleRunSingle(activeScenario)}
                disabled={testResults[activeScenario.id] === 'RUNNING'}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#FF4D4F] hover:bg-[#ff686a] text-white text-xs font-semibold cursor-pointer transition-colors self-start sm:self-auto disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Launch Attack Vector</span>
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-[#9AA3AD] leading-relaxed">
              {activeScenario.description}
            </p>

            {/* Attack Anatomy */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-[#14171B] border border-[#1E232A] rounded-md text-xs mono">
              <div>
                <span className="text-[10px] text-[#626B76] uppercase block">Attacker Payload</span>
                <span className="text-[#FF4D4F] font-semibold break-all">
                  {activeScenario.promptSnippet}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#626B76] uppercase block">Target Tool Call</span>
                <span className="text-[#4A9EFF] font-semibold break-all">
                  {activeScenario.capability}(&ldquo;{activeScenario.resource}&rdquo;)
                </span>
              </div>
            </div>

            {/* Step-by-Step Defense Trace */}
            <div className="space-y-2 pt-2">
              <div className="text-[11px] uppercase tracking-wider font-semibold text-[#626B76]">
                Runtime Inspection Pipeline Execution
              </div>

              <div className="space-y-2 bg-[#08090B] border border-[#1E232A] rounded-lg p-4">
                {activeScenario.steps.map((step, idx) => {
                  const isDone = activeStepIndex >= idx || testResults[activeScenario.id] === 'PASS';
                  const isCurrent = activeStepIndex === idx;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 text-xs mono transition-all ${
                        isDone
                          ? 'text-[#2ED47A]'
                          : isCurrent
                          ? 'text-[#4A9EFF] font-semibold'
                          : 'text-[#3F464E]'
                      }`}
                    >
                      <span className="w-4 h-4 flex items-center justify-center shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-[#2ED47A]" />
                        ) : isCurrent ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#4A9EFF] animate-ping" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-[#2A3038]" />
                        )}
                      </span>
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Result Outcome Badge */}
            {testResults[activeScenario.id] === 'PASS' && (
              <div className="p-3.5 rounded-lg bg-[#2ED47A]/10 border border-[#2ED47A]/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-[#2ED47A]" />
                  <div>
                    <div className="mono text-xs font-bold text-[#2ED47A]">
                      MOCK POLICY RESULT — PASS
                    </div>
                    <div className="text-[11px] text-[#9AA3AD]">
                      The API blocked or held the request for review. No external action ran.
                    </div>
                  </div>
                </div>
                <div className="mono text-xs text-[#2ED47A] font-semibold">
                  MOCK CHECK
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
